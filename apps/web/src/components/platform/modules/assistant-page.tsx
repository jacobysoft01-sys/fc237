"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { Input } from "@FC237/ui/components/input";
import { useAction, useQuery } from "convex/react";
import { AlertCircle, Bot } from "lucide-react";
import { useState } from "react";

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

  if (message.includes("Finish workspace setup")) {
    return {
      title: "Finish workspace setup",
      detail: "Create or select an organization first so the assistant can read your live FC237 records.",
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
  const sessions = useQuery(api.assistant.listSessions) ?? [];
  const messages = useQuery(api.assistant.listMessages, { sessionId }) ?? [];
  const dashboard = useQuery(api.dashboard.getOverview);
  const sendMessage = useAction(api.assistantActions.sendMessage);

  async function submit(message = content) {
    const prompt = message.trim();
    if (!prompt) return;
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
      description="The FC237 assistant uses your live workspace data with Cameroon-aware governance instructions and can switch between OpenAI and Gemini so guidance stays practical even when one provider is unavailable."
      icon={Bot}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Mode",
              value: dashboard && !dashboard.needsOnboarding ? dashboard.assistantInsight.mode : "Ask",
              detail: dashboard && !dashboard.needsOnboarding ? dashboard.assistantInsight.summary : "Complete the initial questionnaire to activate context-aware guidance.",
              tone: "purple",
            },
            {
              label: "Sessions",
              value: `${sessions.length}`,
              detail: "Stored assistant sessions for the current organization.",
              tone: "green",
            },
            {
              label: "Recommended Actions",
              value: `${dashboard && !dashboard.needsOnboarding ? dashboard.nextActions.length : 0}`,
              detail: "The assistant responds against the same action queue as the dashboard.",
              tone: "orange",
            },
            {
              label: "Runtime",
              value: "OpenAI + Gemini",
              detail: "Responses stay grounded in FC237 records and can fail over between providers when credits or availability change.",
              tone: "green",
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
            {messages.length === 0 ? (
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
                disabled={pending}
                placeholder="Ask about the FC237 journey, inventory, risk, evidence, incidents, reports, or policy work..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <Button disabled={pending} type="submit">
                {pending ? "Thinking..." : "Send"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModulePage>
  );
}
