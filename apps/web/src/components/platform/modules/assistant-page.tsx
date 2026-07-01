"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { Input } from "@FC237/ui/components/input";
import { useAction, useQuery } from "convex/react";
import { AlertCircle, Bot } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { EmptyState, ModulePage, SectionCard, SummaryGrid } from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

const shortcuts = [
  "Guide me through the FC237 workflow from questionnaire to report.",
  "What should I review on the dashboard first?",
  "Which inventory records should I update next?",
  "What risk should I treat first?",
  "Which evidence gaps matter most today?",
  "How ready are we for an incident?",
];

type AssistantUiError = {
  detail: string;
  title: string;
};

function formatAssistantUiError(submissionError: unknown): AssistantUiError {
  const message = submissionError instanceof Error ? submissionError.message : "";

  if (message.includes("Start the initial questionnaire to create your FC237 workspace") || message.includes("Finish workspace setup")) {
    return {
      title: "Create the FC237 workspace first",
      detail: "Start the initial questionnaire before opening the assistant so FC237 has a real organization, inventory, and governance baseline to read from.",
    };
  }

  if (message.includes("Complete the initial questionnaire")) {
    return {
      title: "Complete the first assessment first",
      detail: "The assistant needs the initial questionnaire baseline and dashboard context before it can guide the next compliance step.",
    };
  }

  if (message.includes("saved conversation")) {
    return {
      title: "Conversation unavailable",
      detail: "That saved thread could not be reopened. Start a fresh assistant conversation and continue from there.",
    };
  }

  return {
    title: "Assistant temporarily unavailable",
    detail: "We couldn't complete that request just now. Retry in a moment, or use the guided shortcuts once provider access is restored.",
  };
}

export function AssistantPage() {
  const [sessionId, setSessionId] = useState<any>();
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<AssistantUiError | null>(null);
  const currentWorkspace = useQuery(api.organizations.getCurrent);
  const sessions = useQuery(api.assistant.listSessions) ?? [];
  const messages = useQuery(api.assistant.listMessages, { sessionId }) ?? [];
  const dashboard = useQuery(api.dashboard.getOverview);
  const sendMessage = useAction(api.assistantActions.sendMessage);
  const needsWorkspaceSetup = currentWorkspace !== undefined && !currentWorkspace?.organization;
  const needsQuestionnaire = Boolean(currentWorkspace?.organization && dashboard?.needsOnboarding);
  const assistantLocked = needsWorkspaceSetup || needsQuestionnaire;
  const setupTitle = needsWorkspaceSetup ? "Create the FC237 workspace first" : "Complete the initial questionnaire first";
  const setupDetail = needsWorkspaceSetup
    ? "The assistant only becomes useful after FC237 creates a real organization record, the first inventory, linked controls, and the first action plan."
    : "The assistant has your workspace, but it still needs the questionnaire baseline before it can explain risks, evidence gaps, and next actions from live data.";

  async function submit(message = content) {
    const prompt = message.trim();
    if (!prompt) return;

    if (needsWorkspaceSetup) {
      setError({
        title: "Create the FC237 workspace first",
        detail: "Open the initial questionnaire first so the assistant can work from real FC237 records instead of an empty deployment.",
      });
      return;
    }

    if (needsQuestionnaire) {
      setError({
        title: "Complete the first assessment first",
        detail: "Finish the initial questionnaire so FC237 can generate the baseline dashboard, action plan, risks, and evidence coverage before the assistant responds.",
      });
      return;
    }

    setPending(true);
    setError(null);
    try {
      const result = await sendMessage({ content: prompt, sessionId });
      setSessionId(result.sessionId);
      setContent("");
    } catch (submissionError) {
      setError(formatAssistantUiError(submissionError));
    } finally {
      setPending(false);
    }
  }

  return (
    <ModulePage
      title="Assistant"
      description="The FC237 assistant uses your live workspace data with Cameroon-aware governance instructions, prefers Gemini for day-to-day guidance, and keeps OpenAI available as fallback when Gemini is unavailable."
      icon={Bot}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Mode",
              value: needsWorkspaceSetup ? "Setup" : dashboard && !dashboard.needsOnboarding ? dashboard.assistantInsight.mode : "Baseline",
              detail: needsWorkspaceSetup
                ? "Start the questionnaire to create the live FC237 workspace first."
                : dashboard && !dashboard.needsOnboarding
                  ? dashboard.assistantInsight.summary
                  : "Complete the initial questionnaire to activate context-aware guidance.",
              tone: needsWorkspaceSetup ? "orange" : "purple",
            },
            {
              label: "Sessions",
              value: `${sessions.length}`,
              detail: assistantLocked ? "Sessions appear after FC237 has a live workspace baseline." : "Stored assistant sessions for the current organization.",
              tone: assistantLocked ? "orange" : "green",
            },
            {
              label: "Recommended Actions",
              value: `${dashboard && !dashboard.needsOnboarding ? dashboard.nextActions.length : 0}`,
              detail: "The assistant responds against the same action queue as the dashboard.",
              tone: assistantLocked ? "neutral" : "orange",
            },
            {
              label: "Runtime",
              value: assistantLocked ? "Waiting" : "Gemini first",
              detail: assistantLocked
                ? "Gemini and OpenAI stay behind the guided setup until FC237 has a workspace baseline to ground on."
                : "Responses stay grounded in FC237 records, use Gemini as the primary model path, and fail over to OpenAI only when needed.",
              tone: assistantLocked ? "orange" : "green",
            },
          ]}
        />
      }
      form={null}
    >
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <SectionCard title="Session History" description="Each session keeps the assistant response anchored to the current organization context.">
          <div className="grid gap-2">
            {sessions.length === 0 ? (
              <EmptyState title="No sessions yet" message="Ask one of the suggested prompts to start a structured assistant thread." />
            ) : (
              sessions.map((session: any) => (
                <button
                  className={`rounded-2xl border px-3 py-3 text-left text-sm ${sessionId === session._id ? "border-primary bg-primary/10 text-primary" : "border-border/70"}`}
                  key={session._id}
                  onClick={() => setSessionId(session._id)}
                  type="button"
                >
                  {session.title}
                </button>
              ))
            )}
          </div>
        </SectionCard>

        <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {assistantLocked ? (
              <div className="grid gap-4 rounded-2xl bg-muted/30 p-4">
                <div className="grid gap-2">
                  <p className="text-sm font-semibold">{setupTitle}</p>
                  <p className="text-sm text-muted-foreground">{setupDetail}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link className={buttonVariants()} href="/onboarding">
                    Start Readiness Assessment
                  </Link>
                  <Link className={buttonVariants({ variant: "outline" })} href="/dashboard">
                    Review Dashboard Entry
                  </Link>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="grid gap-4 rounded-2xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  Use the assistant when you want the FC237 journey explained from zero, or when you want the next best action translated through current dashboard scores, inventory, risks, evidence, incidents, reports, or policy state.
                </p>
                <div className="flex flex-wrap gap-2">
                  {shortcuts.map((shortcut) => (
                    <Button disabled={pending} key={shortcut} onClick={() => submit(shortcut)} type="button" variant="outline">
                      {shortcut}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-3 rounded-2xl bg-muted/20 p-4">
                {messages.map((message: any) => (
                  <div
                    className={message.senderType === "user" ? "ml-auto max-w-[84%] rounded-2xl bg-primary px-4 py-3 text-primary-foreground" : "max-w-[90%] rounded-2xl bg-background px-4 py-3 shadow-sm"}
                    key={message._id}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.structuredResponse ? (
                      <div className="mt-3 grid gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge tone="purple">{message.structuredResponse.mode}</StatusBadge>
                          {message.structuredResponse.referencedScore ? <StatusBadge tone="green">{message.structuredResponse.referencedScore}</StatusBadge> : null}
                          {message.structuredResponse.provider ? <StatusBadge tone="green">{message.structuredResponse.provider}</StatusBadge> : null}
                          {message.structuredResponse.providerModel ? <StatusBadge tone="orange">{message.structuredResponse.providerModel}</StatusBadge> : null}
                        </div>
                        {message.structuredResponse.deliveryNote ? (
                          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-900 dark:text-amber-200">
                            {message.structuredResponse.deliveryNote}
                          </div>
                        ) : null}
                        <div>
                          <b>Risk:</b> {message.structuredResponse.identifiedRisk}
                        </div>
                        <div>
                          <b>Actions:</b> {message.structuredResponse.recommendedActions.join(" | ")}
                        </div>
                        <div>
                          <b>Evidence:</b> {message.structuredResponse.evidenceToKeep.join(", ")}
                        </div>
                        <div>
                          <b>Next step:</b> {message.structuredResponse.nextStep}
                        </div>
                        <div>
                          <b>Cameroon context:</b> {message.structuredResponse.cameroonContext}
                        </div>
                        <div>
                          <b>Escalation:</b> {message.structuredResponse.escalationNotice}
                        </div>
                        <div>
                          <b>Note:</b> {message.structuredResponse.disclaimer}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
            {error ? (
              <div className="flex items-start gap-3 rounded-3xl border border-rose-300/70 bg-rose-50/90 px-4 py-4 text-sm text-rose-900 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
                <div className="mt-0.5 rounded-full bg-rose-500/15 p-2 text-rose-600 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="font-semibold">{error.title}</p>
                  <p className="text-rose-700/90 dark:text-rose-200/90">{error.detail}</p>
                </div>
              </div>
            ) : null}
            <form
              className="grid grid-cols-[1fr_auto] gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              <Input
                disabled={pending || assistantLocked}
                placeholder="Ask about the FC237 journey, inventory, risk, evidence, incidents, reports, or policy work..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <Button disabled={pending || assistantLocked} type="submit">
                {assistantLocked ? "Start Setup" : pending ? "Thinking..." : "Send"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModulePage>
  );
}
