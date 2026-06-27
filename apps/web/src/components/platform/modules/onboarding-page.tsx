"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { cn } from "@FC237/ui/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createInitialQuestionnaireState,
  detectedGapPreview,
  isQuestionAnswered,
  questionnaireProgress,
  questionnaireQuestionsById,
  questionnaireSteps,
  readMultiAnswer,
  readSingleAnswer,
  reviewSummary,
  toggleMultiValue,
  type QuestionnaireAnswers,
  type QuestionnaireQuestion,
  validateStep,
  visibleQuestionsForStep,
} from "@/components/platform/modules/initial-questionnaire-data";
import { EmptyState, ModulePage, SectionCard, SummaryGrid, fieldClass } from "@/components/platform/modules/shared";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";

const draftStorageKey = "fc237.initial-questionnaire.draft.v2";

export function OnboardingPage() {
  const router = useRouter();
  const currentWorkspace = useQuery(api.organizations.getCurrent);
  const submitQuestionnaire = useMutation(api.questionnaire.submitInitialQuestionnaire);
  const generateReport = useMutation(api.reports.generate);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => createInitialQuestionnaireState());
  const [stepIndex, setStepIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [reportPending, setReportPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(draftStorageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as QuestionnaireAnswers;
      setAnswers({ ...createInitialQuestionnaireState(), ...parsed });
      toast.success("Saved draft restored", {
        description: "Your previous questionnaire answers are back in place so you can keep going.",
      });
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    }
  }, []);

  const step = questionnaireSteps[stepIndex];
  const progress = questionnaireProgress(answers);
  const detectedGaps = detectedGapPreview(answers);
  const currentQuestions = useMemo(() => visibleQuestionsForStep(step, answers), [answers, step]);
  const currentMissing = useMemo(() => validateStep(step, answers), [answers, step]);
  const reviewItems = useMemo(() => reviewSummary(answers), [answers]);

  function sanitizeAnswers(next: QuestionnaireAnswers) {
    const sanitized = { ...next };
    if (readSingleAnswer(sanitized, "q9") === "No") sanitized.q10 = [];
    if (!["Yes, formally", "Informally"].includes(readSingleAnswer(sanitized, "q23"))) sanitized.q24 = [];
    if (readSingleAnswer(sanitized, "q49") === "No") {
      sanitized.q50 = [];
      sanitized.q51 = [];
      sanitized.q52 = "";
      sanitized.q53 = "";
      sanitized.q54 = "";
      sanitized.q55 = "";
    }
    return sanitized;
  }

  function updateAnswer(question: QuestionnaireQuestion, value: string | string[]) {
    setErrorMessage(null);
    setAnswers((current) => sanitizeAnswers({ ...current, [question.id]: value }));
  }

  function saveDraft() {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(answers));
    toast.success("Draft saved locally", {
      description: "You can leave this page and return later without losing your progress on this device.",
    });
  }

  function jumpToStep(index: number) {
    setErrorMessage(null);
    setStepIndex(index);
  }

  function stepCompleted(index: number) {
    const targetStep = questionnaireSteps[index];
    const visibleQuestions = visibleQuestionsForStep(targetStep, answers);
    return visibleQuestions.length > 0 && visibleQuestions.every((question) => !validateStep(targetStep, answers).includes(question.id));
  }

  async function continueOrSubmit() {
    if (currentMissing.length > 0) {
      const firstMissingPrompt = questionnaireQuestionsById[currentMissing[0]]?.prompt ?? "Complete the remaining questions on this step.";
      setErrorMessage(`A few answers are still missing on this step. Start with: ${firstMissingPrompt}`);
      return;
    }

    if (step.id !== "review-roadmap") {
      setStepIndex((current) => Math.min(current + 1, questionnaireSteps.length - 1));
      return;
    }

    if (readSingleAnswer(answers, "q61") === "No, save answers as draft") {
      saveDraft();
      return;
    }

    if (readSingleAnswer(answers, "q61") !== "Yes, generate my roadmap") {
      setErrorMessage("Choose whether FC237 should generate the roadmap now or save your answers as a draft first.");
      return;
    }

    setPending(true);
    setErrorMessage(null);

    try {
      const result = await submitQuestionnaire({ answers });
      window.localStorage.removeItem(draftStorageKey);
      setRoadmapResult(result);
      toast.success("Your FC237 baseline has been created", {
        description: "The dashboard, risks, controls, evidence requirements, and action plan are now populated from your answers.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The questionnaire could not be submitted right now.";
      setErrorMessage(message);
      toast.error("We could not generate the roadmap", {
        description: message,
      });
    } finally {
      setPending(false);
    }
  }

  async function generateInitialReport() {
    setReportPending(true);
    try {
      await generateReport({ reportType: "compliance_readiness_summary" });
      toast.success("Initial report stored", {
        description: "The readiness summary has been generated from the live questionnaire baseline.",
      });
      router.push("/reports");
    } catch (error) {
      toast.error("Report generation failed", {
        description: error instanceof Error ? error.message : "The report could not be generated right now.",
      });
    } finally {
      setReportPending(false);
    }
  }

  if (currentWorkspace === undefined && !roadmapResult) {
    return (
      <ModulePage
        title="FC237 Initial Questionnaire"
        description="Starting from a practical questionnaire keeps the command center grounded in your real cybersecurity habits, cloud usage, and governance gaps."
        icon={ClipboardList}
      >
        <SectionCard title="Loading baseline questionnaire">
          <div className="grid gap-4">
            <div className="h-20 animate-pulse rounded-3xl bg-muted" />
            <div className="h-96 animate-pulse rounded-3xl bg-muted" />
          </div>
        </SectionCard>
      </ModulePage>
    );
  }

  if (currentWorkspace?.organization && !roadmapResult) {
    return (
      <ModulePage
        title="FC237 Initial Questionnaire"
        description="This workspace already has an active organization context, so the command center is ready to use."
        icon={ClipboardList}
        summary={
          <SummaryGrid
            items={[
              {
                label: "Workspace",
                value: currentWorkspace.organization.name,
                detail: "The live organization record is already active.",
                tone: "green",
              },
              {
                label: "Sector",
                value: currentWorkspace.organization.sector,
                detail: "Stored on the organization baseline.",
              },
              {
                label: "Readiness",
                value: `${currentWorkspace.organization.readinessScore}%`,
                detail: "Current readiness score already exists for this workspace.",
                tone: currentWorkspace.organization.readinessScore >= 70 ? "green" : "orange",
              },
              {
                label: "Next Move",
                value: "Dashboard",
                detail: "Continue from the live command center instead of creating a second baseline.",
                tone: "purple",
              },
            ]}
          />
        }
      >
        <SectionCard title="Workspace already active" description="The questionnaire entry point is meant for new organizations before the dashboard is populated.">
          <div className="grid gap-4">
            <div className="rounded-3xl border border-border/70 bg-muted/20 p-5 text-sm text-muted-foreground">
              This account already has an active FC237 workspace. To avoid duplicate organizations, the guided questionnaire is now locked and the live command center stays in control.
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={buttonVariants()} href="/dashboard">
                Open Dashboard
              </Link>
              <Link className={buttonVariants({ variant: "outline" })} href="/action-plan">
                Open Action Plan
              </Link>
            </div>
          </div>
        </SectionCard>
      </ModulePage>
    );
  }

  if (roadmapResult) {
    return (
      <ModulePage
        title="Your FC237 Baseline Has Been Created"
        description="The questionnaire has been converted into a live organization baseline, a readiness score, real risks, mapped controls, evidence requirements, and a prioritized action queue."
        icon={CheckCircle2}
        summary={
          <SummaryGrid
            items={[
              {
                label: "Readiness Score",
                value: `${roadmapResult.readinessScore}%`,
                detail: `Initial status: ${roadmapResult.readinessStatus}.`,
                tone:
                  roadmapResult.readinessScore >= 86
                    ? "green"
                    : roadmapResult.readinessScore >= 51
                      ? "orange"
                      : "red",
              },
              {
                label: "Risks Created",
                value: `${roadmapResult.counts.risks}`,
                detail: "The first risk register was generated directly from the questionnaire.",
                tone: roadmapResult.counts.risks > 0 ? "orange" : "green",
              },
              {
                label: "Open Actions",
                value: `${roadmapResult.generated.generated}`,
                detail: "The first action queue is ready in the existing tasks table.",
                tone: roadmapResult.generated.generated > 0 ? "orange" : "green",
              },
              {
                label: "Evidence Gaps",
                value: `${roadmapResult.missingEvidenceTitles.length}`,
                detail: "Missing evidence requirements were created where proof is still absent.",
                tone: roadmapResult.missingEvidenceTitles.length > 0 ? "orange" : "green",
              },
            ]}
          />
        }
      >
        <SectionCard title="Next step unlocked" description="Your FC237 baseline has been created. Choose where you want to work next.">
          <div className="grid gap-5">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-800 dark:text-emerald-200">
              {"Complete questionnaire -> review dashboard -> clean inventory -> treat risks -> implement controls -> upload evidence -> improve maturity -> generate report."}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={buttonVariants()} href="/dashboard">
                View Dashboard
              </Link>
              <Link className={buttonVariants({ variant: "outline" })} href="/action-plan">
                View Action Plan
              </Link>
              <Link className={buttonVariants({ variant: "outline" })} href={"/inventory" as Route}>
                Open Cloud Inventory
              </Link>
              <Button disabled={reportPending} onClick={generateInitialReport}>
                {reportPending ? "Generating report..." : "Generate Initial Report"}
              </Button>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="What FC237 generated" description="These counts come from the real records stored from your answers.">
            <div className="grid gap-3 md:grid-cols-2">
              <ResultStat label="Cloud services" value={`${roadmapResult.counts.cloudServices}`} icon={FolderCheck} />
              <ResultStat label="AI systems" value={`${roadmapResult.counts.aiSystems}`} icon={Sparkles} />
              <ResultStat label="Controls" value={`${roadmapResult.counts.controls}`} icon={ShieldCheck} />
              <ResultStat label="Policies" value={`${roadmapResult.counts.policies}`} icon={FileText} />
            </div>
          </SectionCard>

          <SectionCard title="Weakest baseline domains" description="These became the first teaching and action priorities.">
            <div className="grid gap-3">
              {roadmapResult.weakestDomains.map((item: any) => (
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4" key={item.key}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{item.label}</div>
                    <StatusBadge tone={item.score >= 71 ? "green" : item.score >= 51 ? "orange" : "red"}>{item.score}%</StatusBadge>
                  </div>
                  <div className="mt-3">
                    <ProgressLine value={item.score} tone={item.score >= 71 ? "green" : item.score >= 51 ? "orange" : "red"} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Generated risks" description="These are the first issues FC237 surfaced from your real answers.">
            <div className="grid gap-3">
              {roadmapResult.riskTitles.slice(0, 6).map((risk: string) => (
                <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm" key={risk}>
                  {risk}
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Missing evidence" description="These artifacts now matter most for reporting and assurance.">
            {roadmapResult.missingEvidenceTitles.length === 0 ? (
              <EmptyState title="Evidence baseline looks healthy" message="No missing evidence requirements were generated from the questionnaire answers." />
            ) : (
              <div className="grid gap-3">
                {roadmapResult.missingEvidenceTitles.slice(0, 6).map((item: string) => (
                  <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title="FC237 Initial Questionnaire"
      description="This guided baseline turns real cyber habits, cloud usage, data handling, AI use, and evidence maturity into the first compliance roadmap instead of leaving you with an empty dashboard."
      icon={ClipboardList}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Current Step",
              value: `${stepIndex + 1}/${questionnaireSteps.length}`,
              detail: step.title,
              tone: "purple",
            },
            {
              label: "Required Answers",
              value: `${progress.answered}/${progress.total}`,
              detail: `${progress.percent}% of the visible required baseline is complete.`,
              tone: progress.percent >= 70 ? "green" : progress.percent >= 40 ? "orange" : "red",
            },
            {
              label: "Likely Gaps",
              value: `${detectedGaps.length}`,
              detail: detectedGaps.length > 0 ? detectedGaps.slice(0, 2).join(" • ") : "No obvious high-priority gaps detected yet.",
              tone: detectedGaps.length > 0 ? "orange" : "green",
            },
            {
              label: "Roadmap Mode",
              value: "Guided",
              detail: "Each step explains what FC237 will generate from the answers you provide.",
              tone: "green",
            },
          ]}
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <SectionCard title="Questionnaire Map" description="Move step by step. Completed sections stay clickable so you can revise them before generating the roadmap.">
          <div className="grid gap-3">
            {questionnaireSteps.map((item, index) => {
              const active = index === stepIndex;
              const complete = stepCompleted(index);
              return (
                <button
                  className={cn(
                    "rounded-3xl border px-4 py-4 text-left transition",
                    active
                      ? "border-primary/40 bg-primary/10 shadow-sm"
                      : complete
                        ? "border-emerald-500/20 bg-emerald-500/10"
                        : "border-border/70 bg-background/80 hover:border-primary/20 hover:bg-muted/25",
                  )}
                  key={item.id}
                  onClick={() => jumpToStep(index)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Step {index + 1}</div>
                      <div className="mt-2 text-sm font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <StatusBadge tone={active ? "purple" : complete ? "green" : "neutral"}>{active ? "Current" : complete ? "Done" : "Open"}</StatusBadge>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard title={step.title} description={step.description}>
            <div className="grid gap-5">
              <div className="rounded-3xl border border-border/70 bg-muted/20 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Baseline progress</div>
                    <div className="mt-2 text-2xl font-semibold">{progress.percent}%</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {progress.answered} of {progress.total} required answers completed across the visible questionnaire.
                    </div>
                  </div>
                  <StatusBadge tone="purple">{step.title}</StatusBadge>
                </div>
                <div className="mt-4">
                  <ProgressLine value={progress.percent} />
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-800 dark:text-rose-200">
                  {errorMessage}
                </div>
              ) : null}

              {step.id === "review-roadmap" ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {reviewItems.map((item) => (
                      <div className="rounded-2xl border border-border/70 bg-background/80 p-4" key={item.label}>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
                        <div className="mt-2 text-sm">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-border/70 bg-muted/20 p-5">
                    <div className="text-sm font-semibold">What FC237 is likely to generate first</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {detectedGaps.length === 0 ? (
                        <StatusBadge tone="green">No major gaps detected yet</StatusBadge>
                      ) : (
                        detectedGaps.map((gap) => (
                          <StatusBadge key={gap} tone="orange">
                            {gap}
                          </StatusBadge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4">
                {currentQuestions.map((question) => (
                  <QuestionCard
                    answers={answers}
                    key={question.id}
                    onChange={updateAnswer}
                    question={question}
                  />
                ))}
              </div>

              <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">What this step unlocks</div>
                <div className="mt-3 grid gap-2">
                  {step.outcomes.map((outcome) => (
                    <div className="rounded-2xl border border-border/60 bg-muted/15 px-4 py-3 text-sm" key={outcome}>
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button disabled={stepIndex === 0 || pending} onClick={() => jumpToStep(Math.max(stepIndex - 1, 0))} variant="outline">
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <Button disabled={pending} onClick={saveDraft} variant="outline">
                    Save Draft
                  </Button>
                </div>
                <Button disabled={pending} onClick={continueOrSubmit}>
                  {pending ? "Generating roadmap..." : step.id === "review-roadmap" ? "Generate FC237 roadmap" : "Continue"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </ModulePage>
  );
}

function QuestionCard({
  question,
  answers,
  onChange,
}: {
  question: QuestionnaireQuestion;
  answers: QuestionnaireAnswers;
  onChange: (question: QuestionnaireQuestion, value: string | string[]) => void;
}) {
  const answered = isQuestionAnswered(question, answers);

  return (
    <Card className="rounded-[1.75rem] border-0 shadow-sm ring-1 ring-border/80">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{question.prompt}</CardTitle>
            {question.helper ? <CardDescription className="mt-2">{question.helper}</CardDescription> : null}
          </div>
          <StatusBadge tone={answered ? "green" : "neutral"}>{answered ? "Answered" : "Pending"}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {question.type === "text" ? (
          <input
            className={fieldClass}
            onChange={(event) => onChange(question, event.target.value)}
            placeholder={question.placeholder}
            type="text"
            value={readSingleAnswer(answers, question.id)}
          />
        ) : null}

        {question.type === "single" ? (
          <div className="grid gap-3 md:grid-cols-2">
            {question.options?.map((option) => (
              <button
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left text-sm transition",
                  readSingleAnswer(answers, question.id) === option
                    ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
                    : "border-border/70 bg-background/80 hover:border-primary/25 hover:bg-muted/20",
                )}
                key={option}
                onClick={() => onChange(question, option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {question.type === "multi" ? (
          <div className="grid gap-3 md:grid-cols-2">
            {question.options?.map((option) => {
              const current = readMultiAnswer(answers, question.id);
              const selected = current.includes(option);
              return (
                <button
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left text-sm transition",
                    selected
                      ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
                      : "border-border/70 bg-background/80 hover:border-primary/25 hover:bg-muted/20",
                  )}
                  key={option}
                  onClick={() => onChange(question, toggleMultiValue(question, current, option))}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ResultStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof FolderCheck;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
