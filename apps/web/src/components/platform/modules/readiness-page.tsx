"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { Cloud, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, ModulePage, SectionCard, SummaryGrid, fieldClass, scoreTone } from "@/components/platform/modules/shared";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";

const answerScale = [
  { value: 1, label: "1 - Not started" },
  { value: 2, label: "2 - Ad hoc" },
  { value: 3, label: "3 - Basic" },
  { value: 4, label: "4 - Mostly in place" },
  { value: 5, label: "5 - Strong and repeatable" },
];

export function ReadinessPage() {
  const assessments = useQuery(api.assessments.list) ?? [];
  const questionBank = useQuery(api.assessments.getReadinessQuestionBank) ?? [];
  const dashboard = useQuery(api.dashboard.getOverview);
  const submitReadiness = useMutation(api.assessments.submitReadiness);
  const generateFollowUps = useMutation(api.assessments.generateFollowUpActions);
  const [responses, setResponses] = useState<Record<string, number>>({
    cloud_inventory: 4,
    mfa: 3,
    backup: 4,
    access_review: 2,
    vendor_review: 2,
    incident_readiness: 2,
    evidence_maturity: 3,
  });
  const [summary, setSummary] = useState(
    "This assessment focuses on identity, backup, vendor discipline, evidence, and incident readiness.",
  );

  const projectedScore = useMemo(() => {
    const values = Object.values(responses);
    return Math.round((values.reduce((sum, value) => sum + value, 0) / (values.length * 5)) * 100);
  }, [responses]);

  const domainCards = dashboard && !dashboard.needsOnboarding ? dashboard.domainScores : [];

  return (
    <ModulePage
      title="Readiness Assessment"
      description="Run the fixed Phase 1 readiness question bank and turn weak answers into stored assessment responses, domain score updates, and follow-up actions."
      icon={Cloud}
      actions={
        <Button onClick={() => generateFollowUps({})} variant="outline">
          <Sparkles className="size-4" />
          Refresh Follow-up Actions
        </Button>
      }
      summary={
        <SummaryGrid
          items={[
            {
              label: "Projected Score",
              value: `${projectedScore}%`,
              detail: "Based on the current answer selection before submission.",
              tone: projectedScore >= 70 ? "green" : projectedScore >= 50 ? "orange" : "red",
            },
            {
              label: "Submitted Assessments",
              value: `${assessments.length}`,
              detail: "Question-level readiness submissions stored for the organization.",
              tone: "purple",
            },
            {
              label: "Cloud Readiness",
              value: `${domainCards.find((item: any) => item.key === "cloud_readiness")?.score ?? 0}%`,
              detail: domainCards.find((item: any) => item.key === "cloud_readiness")?.detail ?? "Waiting for stored score.",
              tone: scoreTone(domainCards.find((item: any) => item.key === "cloud_readiness")?.status ?? "neutral"),
            },
            {
              label: "Incident Readiness",
              value: `${domainCards.find((item: any) => item.key === "incident_readiness")?.score ?? 0}%`,
              detail: domainCards.find((item: any) => item.key === "incident_readiness")?.detail ?? "Waiting for stored score.",
              tone: scoreTone(domainCards.find((item: any) => item.key === "incident_readiness")?.status ?? "neutral"),
            },
          ]}
        />
      }
      formTitle="Assess the operating loop"
      formDescription="Every answer is stored individually, grouped by domain, and used to refresh scoring and action generation."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await submitReadiness({
              summary,
              answers: questionBank.map((question: any) => ({
                questionKey: question.key,
                answer: answerScale.find((item) => item.value === responses[question.key])?.label ?? "Not scored",
                score: responses[question.key],
              })),
            });
          }}
        >
          <div className="grid gap-4">
            {questionBank.map((question: any) => (
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4" key={question.key}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{question.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{question.domain}</div>
                  </div>
                  <StatusBadge tone="purple">{responses[question.key]}/5</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{question.prompt}</p>
                <select
                  className={`${fieldClass} mt-3`}
                  value={responses[question.key]}
                  onChange={(event) =>
                    setResponses((current) => ({ ...current, [question.key]: Number(event.target.value) }))
                  }
                >
                  {answerScale.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Projected readiness score</span>
                <span>{projectedScore}%</span>
              </div>
              <div className="mt-3">
                <ProgressLine value={projectedScore} tone={projectedScore >= 70 ? "green" : projectedScore >= 50 ? "orange" : "red"} />
              </div>
              <textarea
                className={`${fieldClass} mt-4`}
                rows={4}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </div>
            <Button type="submit">Submit readiness assessment</Button>
          </div>
        </form>
      }
    >
      <SectionCard title="Stored Assessments" description="The latest assessment drives the dashboard scorecards and follow-up queue.">
        {assessments.length === 0 ? (
          <EmptyState
            title="No readiness assessments yet"
            message="Submit the question bank once to populate question-level responses, domain scores, and next actions."
          />
        ) : (
          <div className="grid gap-3">
            {assessments.map((assessment: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-4" key={assessment._id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{assessment.type.replaceAll("_", " ")} assessment</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {assessment.summary ?? "No summary captured for this submission."}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={scoreTone(assessment.classification)}>{assessment.classification}</StatusBadge>
                    <StatusBadge tone="purple">{assessment.score}%</StatusBadge>
                  </div>
                </div>
                {assessment.responses?.length ? (
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {assessment.responses.map((response: any) => (
                      <div className="rounded-xl bg-muted/35 p-3" key={response._id}>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{response.domain}</div>
                        <div className="mt-1 text-sm font-medium">{response.questionKey.replaceAll("_", " ")}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{response.answer}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </ModulePage>
  );
}
