"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { cn } from "@FC237/ui/lib/utils";
import { useConvexAuth, usePreloadedQuery, useQuery } from "convex/react";
import type { Preloaded } from "convex/react";
import {
  ArrowRight,
  Bot,
  Building2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

import { SummaryGrid } from "@/components/platform/modules/shared";
import { PageHeader } from "@/components/platform/page-header";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";
import type { ConvexLoadState } from "@/lib/convex-page-load";

function toneForStatus(status: string) {
  if (status === "Critical" || status === "Weak" || status === "critical" || status === "high") return "red";
  if (status === "Moderate" || status === "moderate") return "orange";
  if (status === "Good" || status === "Strong" || status === "accepted" || status === "green") return "green";
  return "neutral";
}

export function DashboardPage({
  preloadedOverview,
  loadState,
}: {
  preloadedOverview?: Preloaded<typeof api.dashboard.getOverview> | null;
  loadState?: ConvexLoadState | null;
}) {
  if (preloadedOverview) {
    return <DashboardPageWithPreloaded loadState={loadState} preloadedOverview={preloadedOverview} />;
  }
  return <DashboardPageWithLiveQuery loadState={loadState} />;
}

function DashboardPageWithPreloaded({
  preloadedOverview,
  loadState,
}: {
  preloadedOverview: Preloaded<typeof api.dashboard.getOverview>;
  loadState?: ConvexLoadState | null;
}) {
  const overview = usePreloadedQuery(preloadedOverview);
  return <DashboardPageContent loadState={loadState} overview={overview} />;
}

function DashboardPageWithLiveQuery({ loadState }: { loadState?: ConvexLoadState | null }) {
  const fallbackOverview = useQuery(api.dashboard.getOverview);
  return <DashboardPageContent loadState={loadState} overview={fallbackOverview} />;
}

function DashboardPageContent({
  overview,
  loadState,
}: {
  overview: any;
  loadState?: ConvexLoadState | null;
}) {
  const convexAuth = useConvexAuth();

  if (overview === undefined) {
    if (loadState?.message) {
      return <ConvexLoadErrorCard loadState={loadState} />;
    }
    return <DashboardSkeleton />;
  }

  if (overview.needsOnboarding) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          icon={Building2}
          title="Start with the FC237 questionnaire"
          description="Answer the initial guided questionnaire first so the command center can build the organization baseline, score the platform, and generate the first roadmap from real data."
        />
        <Card className="rounded-[1.9rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardContent className="flex flex-col gap-4 p-6">
            <p className="text-sm text-muted-foreground">
              The questionnaire creates the organization profile, cloud and AI inventory, readiness baseline, linked risks, mapped controls, vendor records, evidence requirements, policies, and the first action plan.
            </p>
            <Link className={buttonVariants()} href="/onboarding">
              Start Readiness Assessment
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {!convexAuth.isLoading && !convexAuth.isAuthenticated ? (
        <div className="rounded-2xl border border-orange-500/25 bg-orange-500/8 px-4 py-3 text-sm text-orange-100 dark:text-orange-200">
          Showing a server-loaded snapshot. Live Convex sync is not authenticated yet, so background refresh and some interactive updates may stay limited until Clerk and Convex auth are aligned.
        </div>
      ) : null}

      <PageHeader
        title={`Command Center for ${overview.organization.name}`}
        description="Everything below is driven by stored platform data: seven domain scores, real evidence coverage, linked risks, and a generated action queue with no artificial score floors."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/action-plan">
            <Button size="lg">
              <ClipboardCheck className="size-4" />
              Open Action Plan
            </Button>
          </Link>
          <Link href="/assistant">
            <Button size="lg" variant="outline">
              <Sparkles className="size-4" />
              Ask Assistant
            </Button>
          </Link>
        </div>
      </PageHeader>

      <SummaryGrid
        items={[
          {
            label: "Overall FC237 Score",
            value: `${overview.score.overall}%`,
            detail: `Equal-weight average across seven domains. Current status: ${overview.score.status}.`,
            tone: toneForStatus(overview.score.status),
          },
          {
            label: "Open Actions",
            value: `${overview.nextActions.length}`,
            detail: "Highest-priority recommended actions currently visible in the queue.",
            tone: overview.nextActions.length > 0 ? "orange" : "green",
          },
          {
            label: "Urgent Risks",
            value: `${overview.riskRollup.highOrCritical}`,
            detail: `${overview.riskRollup.withoutControls} risks are still missing linked controls.`,
            tone: overview.riskRollup.highOrCritical > 0 ? "red" : "green",
          },
          {
            label: "Evidence Coverage",
            value: `${overview.evidenceRollup.acceptedCoverage}%`,
            detail: `${overview.evidenceRollup.requiredSlots} required control slots tracked with ${overview.evidenceRollup.submittedCoverage}% submitted coverage.`,
            tone: overview.evidenceRollup.acceptedCoverage >= 70 ? "green" : "orange",
          },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Domain Scores</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {overview.domainScores.map((domain: any) => (
              <div className="rounded-[1.65rem] bg-muted/18 px-5 py-4" key={domain.key}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{domain.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{domain.detail}</div>
                  </div>
                  <StatusBadge tone={toneForStatus(domain.status)}>{domain.status}</StatusBadge>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                  <span className="text-base font-medium">{domain.score}%</span>
                  <span className="text-muted-foreground">Real stored-data score</span>
                </div>
                <div className="mt-2">
                  <ProgressLine value={domain.score} tone={domain.score >= 70 ? "green" : domain.score >= 45 ? "orange" : "red"} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Bot className="size-4 text-muted-foreground" />
              Assistant Insight
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-[1.65rem] bg-muted/18 px-5 py-4">
              <div className="flex items-center gap-2">
                <StatusBadge tone="neutral">{overview.assistantInsight.mode}</StatusBadge>
                <StatusBadge tone={toneForStatus(overview.score.status)}>{overview.score.status}</StatusBadge>
              </div>
              <h2 className="mt-3 text-base font-semibold">{overview.assistantInsight.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{overview.assistantInsight.summary}</p>
            </div>
            <div className="grid gap-2">
              {overview.assistantInsight.recommendedActions.map((action: string) => (
                <div className="rounded-[1.25rem] bg-muted/18 px-4 py-3 text-sm" key={action}>
                  {action}
                </div>
              ))}
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/assistant">
              Open Assistant
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recommended Next Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.nextActions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active recommended actions are open right now.</p>
            ) : (
              overview.nextActions.map((task: any) => (
                <div className="rounded-[1.55rem] bg-muted/18 px-4 py-4" key={task._id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{task.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{task.description ?? "Generated from live platform conditions."}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={toneForStatus(task.priority)}>{task.priority}</StatusBadge>
                      <StatusBadge tone={toneForStatus(task.status)}>{task.status}</StatusBadge>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {`Due ${task.dueDate} - ${task.sourceType.replaceAll("_", " ")}`}
                  </div>
                </div>
              ))
            )}
            <Link className={buttonVariants({ variant: "outline" })} href="/action-plan">
              Manage Full Action Plan
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Risk Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <OverviewLine label="Critical" value={`${overview.riskRollup.byLevel.critical}`} />
            <OverviewLine label="High" value={`${overview.riskRollup.byLevel.high}`} />
            <OverviewLine label="Moderate" value={`${overview.riskRollup.byLevel.moderate}`} />
            <OverviewLine label="Low" value={`${overview.riskRollup.byLevel.low}`} />
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Top Risks</div>
              <div className="mt-3 grid gap-2">
                {overview.topRisks.map((risk: any) => (
                  <div className="rounded-[1.25rem] bg-muted/18 px-4 py-3" key={risk._id}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold">{risk.title}</div>
                      <StatusBadge tone={toneForStatus(risk.riskLevel)}>{risk.riskLevel}</StatusBadge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{`Score ${risk.riskScore} - ${risk.owner}`}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Evidence Coverage</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <OverviewLine label="Required Control Slots" value={`${overview.evidenceRollup.requiredSlots}`} />
            <OverviewLine label="Submitted Coverage" value={`${overview.evidenceRollup.submittedCoverage}%`} />
            <OverviewLine label="Accepted Coverage" value={`${overview.evidenceRollup.acceptedCoverage}%`} />
            <OverviewLine label="Expired Items" value={`${overview.evidenceRollup.expiringCount}`} />
            <div className="rounded-[1.5rem] bg-muted/18 px-4 py-4 text-sm text-muted-foreground">
              Missing evidence slots are created from controls that require proof and do not yet have submitted or accepted artifacts.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Readiness and Maturity Support</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <OverviewLine label="Latest Readiness Score" value={`${overview.readiness.latestAssessmentScore}%`} />
            <OverviewLine label="Maturity Level" value={`${overview.maturitySupport.level} - ${overview.maturitySupport.label}`} />
            <div className="grid gap-3 md:grid-cols-2">
              {overview.maturitySupport.domains.map((domain: any) => (
                <div className="rounded-[1.25rem] bg-muted/18 px-4 py-3" key={domain.key}>
                  <div className="text-sm font-semibold">{domain.domain}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{domain.score}/5</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Report and Activity Signals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3">
              {overview.reportPreviews.map((report: any) => (
                <div className="rounded-[1.55rem] bg-muted/18 px-4 py-4" key={report.key}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{report.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{report.summary}</div>
                    </div>
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[1.55rem] bg-muted/18 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TriangleAlert className="size-4 text-muted-foreground" />
                Recent activity
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {overview.recentActivity.length === 0 ? (
                  <span>No recent audit events yet.</span>
                ) : (
                  overview.recentActivity.map((item: any) => (
                    <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-background/45 px-3 py-2" key={item._id}>
                      <span>{item.action.replaceAll(".", " ")}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/reports">
              Open Reports
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ConvexLoadErrorCard({ loadState }: { loadState: ConvexLoadState }) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        icon={ShieldCheck}
        title="Convex data is not loading"
        description="The dashboard rendered, but the live compliance data feed did not complete. This page now shows the actual integration state instead of an infinite skeleton."
      />
      <Card className="rounded-[1.9rem] border-0 shadow-sm ring-1 ring-border/80">
        <CardContent className="grid gap-4 p-6">
          <div className="rounded-2xl border border-orange-500/25 bg-orange-500/8 p-4 text-sm text-orange-100 dark:text-orange-200">
            {loadState.message ?? "The Convex connection did not finish."}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <DiagnosticPill label="Convex public health" ok={loadState.publicReachable} />
            <DiagnosticPill label="Clerk JWT for Convex" ok={loadState.tokenReady} />
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
              If public health is failing, deploy the Convex backend and verify `NEXT_PUBLIC_CONVEX_URL`.
            </div>
            <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
              If Clerk JWT is failing, confirm the Clerk JWT template named `convex` and the Convex `CLERK_JWT_ISSUER_DOMAIN` setting.
            </div>
            <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
              If both look healthy but the page still stalls in production, deploy the latest Convex functions and schema separately from Vercel.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DiagnosticPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", ok ? "border-emerald-500/20 bg-emerald-500/10" : "border-red-500/20 bg-red-500/10")}>
      <div className="font-medium">{label}</div>
      <div className="mt-1 text-muted-foreground">{ok ? "Available" : "Needs attention"}</div>
    </div>
  );
}

function OverviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1.25rem] bg-muted/18 px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-16 rounded-2xl bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-40 rounded-2xl bg-muted" key={index} />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-muted" />
    </div>
  );
}


