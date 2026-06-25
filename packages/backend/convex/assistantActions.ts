"use node";

import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { v } from "convex/values";

import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";
import {
  buildAssistantWorkspaceContext,
  buildCameroonSystemPrompt,
  buildFallbackResponse,
  detectMode,
  extractResponseText,
  getAssistantResponseFormatSchema,
  parseAssistantResponse,
} from "./assistantShared";

let envLoaded = false;

function ensureLocalOpenAIEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;

  const candidates = [
    resolve(process.cwd(), "open_AI.env.txt"),
    resolve(process.cwd(), "..", "open_AI.env.txt"),
    resolve(process.cwd(), "..", "..", "open_AI.env.txt"),
    resolve(process.cwd(), "..", "..", "..", "open_AI.env.txt"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      loadDotenv({ path: candidate, override: false });
      break;
    }
  }
}

function getOpenAISettings() {
  ensureLocalOpenAIEnvLoaded();

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.open_ai_API_KEY ?? process.env.OPEN_AI_API_KEY;
  const model = process.env.OPENAI_ASSISTANT_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5.5";

  return apiKey ? { apiKey, model } : null;
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

export const sendMessage = action({
  args: {
    content: v.string(),
    sessionId: v.optional(v.id("chatSessions")),
  },
  handler: async (ctx, args) => {
    const current = await ctx.runQuery(api.organizations.getCurrent, {});
    if (!current?.organization || !current.user) {
      throw new Error("Organization setup required");
    }

    const overview = await ctx.runQuery(api.dashboard.getOverview, {});
    if (!overview || overview.needsOnboarding) {
      throw new Error("Complete onboarding before using the assistant");
    }

    const reportPreview = await ctx.runQuery(api.reports.getPreview, {});
    const knowledgeBaseEntries = (await ctx.runQuery(api.knowledgeBase.list, {})) ?? [];
    const messages = args.sessionId ? (await ctx.runQuery(api.assistant.listMessages, { sessionId: args.sessionId })) ?? [] : [];

    const detectedMode = detectMode(args.content);
    const sessionTitle = (args.sessionId ? messages[0]?.content : args.content)?.slice(0, 60) || "FC237 Assistant";
    const openAI = getOpenAISettings();

    let structuredResponse;
    let provider = "OpenAI Responses API";
    let providerModel = openAI?.model ?? "workspace-grounded-fallback";

    if (openAI) {
      try {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAI.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: openAI.model,
            store: false,
            reasoning: { effort: "low" },
            max_output_tokens: 1200,
            input: [
              {
                role: "system",
                content: buildCameroonSystemPrompt(current.organization.name),
              },
              {
                role: "system",
                content: buildAssistantWorkspaceContext({
                  organization: current.organization,
                  overview,
                  reportPreview,
                  knowledgeBaseEntries,
                }),
              },
              ...trimMessageHistory(messages),
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
          const errorText = await response.text();
          throw new Error(`OpenAI request failed (${response.status}): ${errorText.slice(0, 400)}`);
        }

        const payload = await response.json();
        const rawText = extractResponseText(payload);
        const parsed = rawText ? parseAssistantResponse(rawText, detectedMode, openAI.model) : null;

        if (!parsed) {
          throw new Error("OpenAI returned a response without valid structured JSON content.");
        }

        structuredResponse = parsed;
      } catch (error) {
        provider = "FC237 fallback guidance";
        providerModel = "workspace-grounded-fallback";
        structuredResponse = buildFallbackResponse(detectedMode, overview, args.content, {
          fallbackReason: error instanceof Error ? error.message : "The OpenAI request did not complete successfully.",
          provider,
          providerModel,
          reportPreview,
        });
      }
    } else {
      provider = "FC237 fallback guidance";
      providerModel = "workspace-grounded-fallback";
      structuredResponse = buildFallbackResponse(detectedMode, overview, args.content, {
        fallbackReason:
          "No OpenAI API key was found. Set OPENAI_API_KEY or keep open_ai_API_KEY in the local env file and mirror it in the Convex deployment environment for production use.",
        provider,
        providerModel,
        reportPreview,
      });
    }

    const persistence = await ctx.runMutation(internal.assistant.saveConversationTurn, {
      organizationId: current.organization._id,
      userId: current.user._id,
      content: args.content,
      sessionId: args.sessionId,
      sessionTitle,
      assistantText: structuredResponse.answer,
      detectedIntent: structuredResponse.mode,
      structuredResponse,
      provider,
      providerModel,
    });

    return {
      sessionId: persistence.sessionId,
      response: structuredResponse,
    };
  },
});
