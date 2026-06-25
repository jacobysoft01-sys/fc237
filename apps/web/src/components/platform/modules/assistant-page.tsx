"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { Input } from "@FC237/ui/components/input";
import { useAction, useQuery } from "convex/react";
import { Bot } from "lucide-react";
import { useState } from "react";

import { EmptyState, ModulePage, SectionCard, SummaryGrid } from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

const shortcuts = [
  "Run a readiness assessment summary for me.",
  "What risk should I treat first?",
  "Which evidence gaps matter most today?",
  "How ready are we for an incident?",
  "Can I generate the compliance report now?",
  "Which policy should I draft or approve next?",
];

export function AssistantPage() {
  const [sessionId, setSessionId] = useState<any>();
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const sessions = useQuery(api.assistant.listSessions) ?? [];
  const messages = useQuery(api.assistant.listMessages, { sessionId }) ?? [];
  const dashboard = useQuery(api.dashboard.getOverview);
  const sendMessage = useAction(api.assistantActions.sendMessage);

  async function submit(message = content) {
    const prompt = message.trim();
    if (!prompt) return;
    setPending(true);
    setError("");
    try {
      const result = await sendMessage({ content: prompt, sessionId });
      setSessionId(result.sessionId);
      setContent("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Assistant request failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <ModulePage
      title="Assistant"
      description="The FC237 assistant now uses the OpenAI Responses API with workspace grounding and a Cameroon-aware governance prompt so advice stays practical, compliance-minded, and linked to your real platform state."
      icon={Bot}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Mode",
              value: dashboard && !dashboard.needsOnboarding ? dashboard.assistantInsight.mode : "Ask",
              detail: dashboard && !dashboard.needsOnboarding ? dashboard.assistantInsight.summary : "Complete onboarding to activate context-aware guidance.",
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
              value: "OpenAI",
              detail: "Responses are grounded in current FC237 records and a Cameroon-first governance prompt.",
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
                  Use the assistant when you want the next best action explained through current dashboard scores, open actions, risks, evidence, incidents, reports, or policy state, with Cameroon-aware compliance framing.
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
                          {message.structuredResponse.providerModel ? <StatusBadge tone="orange">{message.structuredResponse.providerModel}</StatusBadge> : null}
                        </div>
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
            {error ? <div className="rounded-2xl border border-rose-300/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div> : null}
            <form
              className="grid grid-cols-[1fr_auto] gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              <Input
                disabled={pending}
                placeholder="Ask about readiness, risk, evidence, incidents, reports, or policy work..."
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
