"use node";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";
import {
  type AssistantResponse,
  buildAssistantWorkspaceContext,
  buildCameroonSystemPrompt,
  buildFallbackResponse,
  detectMode,
  extractResponseText,
  getAssistantResponseFormatSchema,
  parseAssistantResponse,
} from "./assistantShared";

type ProviderKind = "openai" | "gemini";

type ProviderSettings = {
  apiKey: string;
  kind: ProviderKind;
  label: string;
  model: string;
};

type ProviderAttemptError = {
  label: string;
};

type SendMessageResult = {
  sessionId: Id<"chatSessions">;
  response: AssistantResponse;
};

let envLoaded = false;

function loadSimpleEnvFile(path: string) {
  const content = readFileSync(path, "utf8");

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key) || process.env[key] !== undefined) continue;

    let value = line.slice(separatorIndex + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value.replace(/\\n/g, "\n");
  }
}

function ensureLocalAiEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;

  const roots = [
    process.cwd(),
    resolve(process.cwd(), ".."),
    resolve(process.cwd(), "..", ".."),
    resolve(process.cwd(), "..", "..", ".."),
  ];
  const fileNames = ["open_AI.env", "open_AI.env.txt", ".env.local"];
  const seen = new Set<string>();

  for (const root of roots) {
    for (const fileName of fileNames) {
      const candidate = resolve(root, fileName);
      if (seen.has(candidate) || !existsSync(candidate)) continue;
      seen.add(candidate);
      try {
        loadSimpleEnvFile(candidate);
      } catch {
        // Ignore unreadable local-only env files and fall back to process env.
      }
    }
  }
}

function getOpenAISettings(): ProviderSettings | null {
  ensureLocalAiEnvLoaded();

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.open_ai_API_KEY ?? process.env.OPEN_AI_API_KEY;
  const model = process.env.OPENAI_ASSISTANT_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5.5";

  return apiKey
    ? {
        apiKey,
        kind: "openai",
        label: "OpenAI Responses API",
        model,
      }
    : null;
}

function getGeminiSettings(): ProviderSettings | null {
  ensureLocalAiEnvLoaded();

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_ASSISTANT_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

  return apiKey
    ? {
        apiKey,
        kind: "gemini",
        label: "Gemini Interactions API",
        model,
      }
    : null;
}

function getProviderOrder() {
  const openai = getOpenAISettings();
  const gemini = getGeminiSettings();
  const configured = [openai, gemini].filter((provider): provider is ProviderSettings => Boolean(provider));
  const preference = (process.env.ASSISTANT_PROVIDER ?? process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  const preferredKind: ProviderKind = preference === "openai" ? "openai" : "gemini";

  return configured.sort((left, right) => Number(left.kind !== preferredKind) - Number(right.kind !== preferredKind));
}

function trimMessageHistory(messages: any[]) {
  return messages
    .slice(-10)
    .map((message) => ({
      role: message.senderType === "assistant" ? "assistant" : "user",
      content: String(message.content ?? "").slice(0, 2500),
    }))
    .filter((message) => message.content.trim().length > 0);
}

function buildGeminiInput(args: {
  organization: any;
  overview: any;
  reportPreview: any;
  knowledgeBaseEntries: any[];
  messages: any[];
  content: string;
}) {
  const history = trimMessageHistory(args.messages)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");

  return [
    "SYSTEM INSTRUCTIONS",
    buildCameroonSystemPrompt(args.organization.name),
    "",
    "WORKSPACE CONTEXT",
    buildAssistantWorkspaceContext({
      organization: args.organization,
      overview: args.overview,
      reportPreview: args.reportPreview,
      knowledgeBaseEntries: args.knowledgeBaseEntries,
    }),
    "",
    history ? "RECENT CONVERSATION" : null,
    history || null,
    "",
    "CURRENT USER REQUEST",
    args.content,
    "",
    "Return only JSON matching the provided schema.",
  ]
    .filter(Boolean)
    .join("\n");
}

function parseProviderErrorPayload(errorText: string) {
  try {
    const payload = JSON.parse(errorText);
    if (typeof payload?.error?.message === "string") return payload.error.message;
    if (typeof payload?.message === "string") return payload.message;
  } catch {
    return errorText;
  }

  return errorText;
}

function formatProviderErrorMessage(providerLabel: string, status: number, errorText: string) {
  const detail = parseProviderErrorPayload(errorText).toLowerCase();

  if (status === 401 || status === 403) {
    return `FC237 could not authenticate with ${providerLabel}. Check the API key and provider access settings.`;
  }

  if (
    status === 402 ||
    status === 429 ||
    detail.includes("quota") ||
    detail.includes("credit") ||
    detail.includes("billing") ||
    detail.includes("rate limit") ||
    detail.includes("resource exhausted")
  ) {
    return `${providerLabel} is temporarily out of credits or rate-limited. FC237 will try another available provider.`;
  }

  if (status >= 500) {
    return `${providerLabel} is temporarily unavailable. FC237 will try another available provider.`;
  }

  return `${providerLabel} could not complete this assistant request right now. FC237 will try another available provider.`;
}

function mergeDeliveryNotes(...notes: Array<string | undefined>) {
  const unique = [...new Set(notes.map((note) => note?.trim()).filter((note): note is string => Boolean(note)))];
  return unique.length > 0 ? unique.join(" ") : undefined;
}

function buildFailoverDeliveryNote(failedAttempts: ProviderAttemptError[], activeProviderLabel: string) {
  if (failedAttempts.length === 0) return undefined;

  if (failedAttempts.length === 1) {
    return `${failedAttempts[0].label} was unavailable for this turn, so FC237 continued with ${activeProviderLabel}.`;
  }

  const providerList = failedAttempts.map((attempt) => attempt.label).join(" and ");
  return `${providerList} were unavailable for this turn, so FC237 continued with ${activeProviderLabel}.`;
}

function buildFallbackDeliveryNote(failedAttempts: ProviderAttemptError[], configuredProviders: ProviderSettings[]) {
  if (configuredProviders.length === 0) {
    return "No AI provider key is configured yet. Add GEMINI_API_KEY or OPENAI_API_KEY to enable live model guidance.";
  }

  if (failedAttempts.length > 0) {
    return "The connected AI providers are temporarily unavailable or out of credits, so FC237 returned workspace-grounded guidance instead.";
  }

  return "FC237 returned workspace-grounded guidance because no live provider completed the request.";
}

async function callOpenAI(args: {
  content: string;
  detectedMode: ReturnType<typeof detectMode>;
  knowledgeBaseEntries: any[];
  messages: any[];
  organization: any;
  overview: any;
  reportPreview: any;
  settings: ProviderSettings;
}) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.settings.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: args.settings.model,
      store: false,
      reasoning: { effort: "low" },
      max_output_tokens: 1200,
      input: [
        {
          role: "system",
          content: buildCameroonSystemPrompt(args.organization.name),
        },
        {
          role: "system",
          content: buildAssistantWorkspaceContext({
            organization: args.organization,
            overview: args.overview,
            reportPreview: args.reportPreview,
            knowledgeBaseEntries: args.knowledgeBaseEntries,
          }),
        },
        ...trimMessageHistory(args.messages),
        {
          role: "user",
          content: args.content,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "fc237_assistant_response",
          schema: getAssistantResponseFormatSchema(),
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(formatProviderErrorMessage(args.settings.label, response.status, await response.text()));
  }

  const payload = await response.json();
  const rawText = extractResponseText(payload);
  const parsed = rawText ? parseAssistantResponse(rawText, args.detectedMode, args.settings.model) : null;

  if (!parsed) {
    throw new Error("OpenAI returned an incomplete assistant response, so FC237 could not safely use it.");
  }

  return {
    ...parsed,
    provider: args.settings.label,
    providerModel: args.settings.model,
  };
}

async function callGemini(args: {
  content: string;
  detectedMode: ReturnType<typeof detectMode>;
  knowledgeBaseEntries: any[];
  messages: any[];
  organization: any;
  overview: any;
  reportPreview: any;
  settings: ProviderSettings;
}) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": args.settings.apiKey,
    },
    body: JSON.stringify({
      model: args.settings.model,
      input: buildGeminiInput({
        organization: args.organization,
        overview: args.overview,
        reportPreview: args.reportPreview,
        knowledgeBaseEntries: args.knowledgeBaseEntries,
        messages: args.messages,
        content: args.content,
      }),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: getAssistantResponseFormatSchema(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(formatProviderErrorMessage(args.settings.label, response.status, await response.text()));
  }

  const payload = await response.json();
  const rawText = typeof payload?.output_text === "string" ? payload.output_text.trim() : extractResponseText(payload);
  const parsed = rawText ? parseAssistantResponse(rawText, args.detectedMode, args.settings.model) : null;

  if (!parsed) {
    throw new Error("Gemini returned an incomplete assistant response, so FC237 could not safely use it.");
  }

  return {
    ...parsed,
    provider: args.settings.label,
    providerModel: args.settings.model,
  };
}

async function requestAssistantResponse(args: {
  content: string;
  detectedMode: ReturnType<typeof detectMode>;
  knowledgeBaseEntries: any[];
  messages: any[];
  organization: any;
  overview: any;
  reportPreview: any;
}) {
  const configuredProviders = getProviderOrder();
  const failedAttempts: ProviderAttemptError[] = [];

  for (const settings of configuredProviders) {
    try {
      const response =
        settings.kind === "openai"
          ? await callOpenAI({ ...args, settings })
          : await callGemini({ ...args, settings });

      return {
        response: {
          ...response,
          deliveryNote: mergeDeliveryNotes(response.deliveryNote, buildFailoverDeliveryNote(failedAttempts, settings.label)),
        },
        provider: settings.label,
        providerModel: settings.model,
      };
    } catch {
      failedAttempts.push({
        label: settings.label,
      });
    }
  }

  const fallback = buildFallbackResponse(args.detectedMode, args.overview, args.content, {
    deliveryNote: buildFallbackDeliveryNote(failedAttempts, configuredProviders),
    provider: "FC237 fallback guidance",
    providerModel: "workspace-grounded-fallback",
    reportPreview: args.reportPreview,
  });

  return {
    response: fallback,
    provider: fallback.provider,
    providerModel: fallback.providerModel,
  };
}

export const sendMessage = action({
  args: {
    content: v.string(),
    sessionId: v.optional(v.id("chatSessions")),
  },
  handler: async (ctx, args): Promise<SendMessageResult> => {
    const current = await ctx.runQuery(api.organizations.getCurrent, {});
    if (!current?.organization || !current.user) {
      throw new Error("Finish workspace setup before using the assistant.");
    }

    const overview = await ctx.runQuery(api.dashboard.getOverview, {});
    if (!overview || overview.needsOnboarding) {
      throw new Error("Complete the initial questionnaire so the assistant can work from your live compliance data.");
    }

    const reportPreview = await ctx.runQuery(api.reports.getPreview, {});
    const knowledgeBaseEntries = (await ctx.runQuery(api.knowledgeBase.list, {})) ?? [];
    const messages = args.sessionId ? (await ctx.runQuery(api.assistant.listMessages, { sessionId: args.sessionId })) ?? [] : [];
    const detectedMode = detectMode(args.content);
    const sessionTitle = (args.sessionId ? messages[0]?.content : args.content)?.slice(0, 60) || "FC237 Assistant";

    const assistantResult = await requestAssistantResponse({
      content: args.content,
      detectedMode,
      knowledgeBaseEntries,
      messages,
      organization: current.organization,
      overview,
      reportPreview,
    });

    const persistence: { sessionId: Id<"chatSessions"> } = await ctx.runMutation(internal.assistant.saveConversationTurn, {
      organizationId: current.organization._id,
      userId: current.user._id,
      content: args.content,
      sessionId: args.sessionId,
      sessionTitle,
      assistantText: assistantResult.response.answer,
      detectedIntent: assistantResult.response.mode,
      structuredResponse: assistantResult.response,
      provider: assistantResult.provider,
      providerModel: assistantResult.providerModel,
    });

    return {
      sessionId: persistence.sessionId,
      response: assistantResult.response,
    };
  },
});
