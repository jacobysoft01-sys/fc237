"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useConvexAuth, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import type { Preloaded } from "convex/react";
import { ClipboardCheck, RefreshCcw } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

import { EmptyState, FilterButton, ModulePage, SectionCard, SummaryGrid, priorityTone, statusTone } from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";
import type { ConvexLoadState } from "@/lib/convex-page-load";

function actionPlanArgs(priority?: string, status?: string, sourceType?: string) {
  return {
    ...(priority ? { priority } : {}),
    ...(status ? { status } : {}),
    ...(sourceType ? { sourceType } : {}),
  };
}

export function ActionPlanPage({
  preloadedActionPlan,
  loadState,
}: {
  preloadedActionPlan?: Preloaded<typeof api.tasks.getActionPlan> | null;
  loadState?: ConvexLoadState | null;
}) {
  if (preloadedActionPlan) {
    return <ActionPlanPageWithPreloaded loadState={loadState} preloadedActionPlan={preloadedActionPlan} />;
  }
  return <ActionPlanPageWithLiveQuery loadState={loadState} />;
}

function ActionPlanPageWithPreloaded({
  preloadedActionPlan,
  loadState,
}: {
  preloadedActionPlan: Preloaded<typeof api.tasks.getActionPlan>;
  loadState?: ConvexLoadState | null;
}) {
  const [priority, setPriority] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [sourceType, setSourceType] = useState<string>();
  const actionPlan = usePreloadedQuery(preloadedActionPlan);
  const filteredActionPlan = useQuery(api.tasks.getActionPlan, actionPlanArgs(priority, status, sourceType));
  const visibleActionPlan = !priority && !status && !sourceType ? actionPlan : filteredActionPlan;
  const updateStatus = useMutation(api.tasks.updateStatus);
  const regenerate = useMutation(api.tasks.regenerateGenerated);
  const convexAuth = useConvexAuth();

  return (
    <ActionPlanPageContent
      actionPlan={visibleActionPlan}
      convexAuth={convexAuth}
      loadState={loadState}
      regenerate={regenerate}
      setPriority={setPriority}
      setSourceType={setSourceType}
      setStatus={setStatus}
      status={status}
      sourceType={sourceType}
      priority={priority}
      updateStatus={updateStatus}
    />
  );
}

function ActionPlanPageWithLiveQuery({ loadState }: { loadState?: ConvexLoadState | null }) {
  const [priority, setPriority] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [sourceType, setSourceType] = useState<string>();
  const actionPlan = useQuery(api.tasks.getActionPlan, actionPlanArgs(priority, status, sourceType));
  const updateStatus = useMutation(api.tasks.updateStatus);
  const regenerate = useMutation(api.tasks.regenerateGenerated);
  const convexAuth = useConvexAuth();

  return (
    <ActionPlanPageContent
      actionPlan={actionPlan}
      convexAuth={convexAuth}
      loadState={loadState}
      regenerate={regenerate}
      setPriority={setPriority}
      setSourceType={setSourceType}
      setStatus={setStatus}
      status={status}
      sourceType={sourceType}
      priority={priority}
      updateStatus={updateStatus}
    />
  );
}

function ActionPlanPageContent({
  actionPlan,
  convexAuth,
  loadState,
  regenerate,
  setPriority,
  setSourceType,
  setStatus,
  status,
  sourceType,
  priority,
  updateStatus,
}: {
  actionPlan: any;
  convexAuth: ReturnType<typeof useConvexAuth>;
  loadState?: ConvexLoadState | null;
  regenerate: any;
  setPriority: Dispatch<SetStateAction<string | undefined>>;
  setSourceType: Dispatch<SetStateAction<string | undefined>>;
  setStatus: Dispatch<SetStateAction<string | undefined>>;
  status?: string;
  sourceType?: string;
  priority?: string;
  updateStatus: any;
}) {
  if (!actionPlan) {
    if (loadState?.message) {
      return (
        <ModulePage
          title="Action Plan"
          description="Generated and manual action items stay in one execution queue with linked context to risks, controls, evidence, vendors, incidents, and assessments."
          icon={ClipboardCheck}
        >
          <SectionCard title="Convex data is not loading">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-orange-500/25 bg-orange-500/8 px-4 py-4 text-sm text-orange-100 dark:text-orange-200">
                {loadState.message}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm">
                  <div className="font-medium">Convex public health</div>
                  <div className="mt-1 text-muted-foreground">{loadState.publicReachable ? "Available" : "Needs attention"}</div>
                </div>
                <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm">
                  <div className="font-medium">Clerk JWT for Convex</div>
                  <div className="mt-1 text-muted-foreground">{loadState.tokenReady ? "Available" : "Needs attention"}</div>
                </div>
              </div>
            </div>
          </SectionCard>
        </ModulePage>
      );
    }
    return (
      <ModulePage
        title="Action Plan"
        description="Generated and manual action items stay in one execution queue with linked context to risks, controls, evidence, vendors, incidents, and assessments."
        icon={ClipboardCheck}
      >
        <SectionCard title="Loading action plan">
          <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        </SectionCard>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title="Action Plan"
      description="Work the FC237 operating loop from one place. Filter by priority, status, or source entity and keep every item tied to the record that created it."
      icon={ClipboardCheck}
      actions={
        <Button onClick={() => regenerate({})} variant="outline">
          <RefreshCcw className="size-4" />
          Regenerate Actions
        </Button>
      }
      summary={
        <SummaryGrid
          items={[
            {
              label: "Active Actions",
              value: `${actionPlan.summary.active}`,
              detail: "Open or in-progress items in the current queue.",
              tone: actionPlan.summary.active > 0 ? "orange" : "green",
            },
            {
              label: "Critical",
              value: `${actionPlan.summary.critical}`,
              detail: "Critical actions that should move before the next reporting cycle.",
              tone: actionPlan.summary.critical > 0 ? "red" : "green",
            },
            {
              label: "Tracked Items",
              value: `${actionPlan.summary.total}`,
              detail: "Manual and generated action items stored in the existing tasks table.",
            },
            {
              label: "Source Types",
              value: `${actionPlan.filters.sourceTypes.length}`,
              detail: "Task sources currently represented in the plan.",
              tone: "purple",
            },
          ]}
        />
      }
      form={null}
    >
      {!convexAuth.isLoading && !convexAuth.isAuthenticated ? (
        <SectionCard title="Live sync pending">
          <div className="rounded-2xl border border-orange-500/25 bg-orange-500/8 px-4 py-3 text-sm text-orange-100 dark:text-orange-200">
            Showing a server-loaded snapshot. Live Convex sync is not authenticated yet, so refreshing filters or updating task state may stay limited until Clerk and Convex auth are aligned.
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Filters" description="Narrow the queue without leaving the page.">
        <div className="grid gap-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Priority</div>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={!priority} onClick={() => setPriority(undefined)}>
                All
              </FilterButton>
              {actionPlan.filters.priorities.map((item: string) => (
                <FilterButton active={priority === item} key={item} onClick={() => setPriority(item)}>
                  {item.replaceAll("_", " ")}
                </FilterButton>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Status</div>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={!status} onClick={() => setStatus(undefined)}>
                All
              </FilterButton>
              {actionPlan.filters.statuses.map((item: string) => (
                <FilterButton active={status === item} key={item} onClick={() => setStatus(item)}>
                  {item.replaceAll("_", " ")}
                </FilterButton>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Source</div>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={!sourceType} onClick={() => setSourceType(undefined)}>
                All
              </FilterButton>
              {actionPlan.filters.sourceTypes.map((item: string) => (
                <FilterButton active={sourceType === item} key={item} onClick={() => setSourceType(item)}>
                  {item.replaceAll("_", " ")}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Execution Queue"
        description="Each action item stays linked to the evidence, risk, control, vendor, incident, assessment, or policy that created it."
      >
        {actionPlan.items.length === 0 ? (
          <EmptyState
            title="No actions match the current filters"
            message="Try widening the filters or regenerate actions to refresh the queue from the current readiness, risk, evidence, vendor, policy, and incident state."
          />
        ) : (
          <div className="grid gap-4">
            {actionPlan.items.map((task: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={task._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{task.title}</h3>
                      <StatusBadge tone={priorityTone(task.priority)}>{task.priority}</StatusBadge>
                      <StatusBadge tone={statusTone(task.status)}>{task.status.replaceAll("_", " ")}</StatusBadge>
                      <StatusBadge tone="purple">{task.sourceType.replaceAll("_", " ")}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {task.description ?? "This action was created from a linked platform condition and should be kept current with real evidence."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.status !== "done" ? (
                      <Button onClick={() => updateStatus({ taskId: task._id, status: "done", completionNotes: "Completed from the action plan." })} size="sm">
                        Mark Done
                      </Button>
                    ) : null}
                    {task.status !== "in_progress" ? (
                      <Button onClick={() => updateStatus({ taskId: task._id, status: "in_progress" })} size="sm" variant="outline">
                        Start
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Owner</div>
                    <div className="mt-1 text-sm">{task.owner ?? "Unassigned"}</div>
                  </div>
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Due Date</div>
                    <div className="mt-1 text-sm">{task.dueDate}</div>
                  </div>
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Source Id</div>
                    <div className="mt-1 break-all text-sm">{task.sourceId ?? "Generated from platform state"}</div>
                  </div>
                  <div className="rounded-xl bg-muted/35 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Notes</div>
                    <div className="mt-1 text-sm">{task.completionNotes ?? "No completion note yet."}</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {task.linkedSummary?.risk ? (
                    <LinkedSummaryCard
                      label="Related Risk"
                      title={task.linkedSummary.risk.title}
                      meta={`${task.linkedSummary.risk.riskLevel ?? task.linkedSummary.risk.level ?? "linked"} risk`}
                    />
                  ) : null}
                  {task.linkedSummary?.control ? (
                    <LinkedSummaryCard
                      label="Related Control"
                      title={task.linkedSummary.control.name ?? task.linkedSummary.control.title}
                      meta={task.linkedSummary.control.implementationStatus ?? task.linkedSummary.control.status ?? "tracked"}
                    />
                  ) : null}
                  {task.linkedSummary?.evidence ? (
                    <LinkedSummaryCard
                      label="Related Evidence"
                      title={task.linkedSummary.evidence.title}
                      meta={task.linkedSummary.evidence.status}
                    />
                  ) : null}
                  {task.linkedSummary?.vendor ? (
                    <LinkedSummaryCard
                      label="Related Vendor"
                      title={task.linkedSummary.vendor.vendorName ?? task.linkedSummary.vendor.title}
                      meta={`${task.linkedSummary.vendor.score ?? 0}% vendor score`}
                    />
                  ) : null}
                  {task.linkedSummary?.incident ? (
                    <LinkedSummaryCard
                      label="Related Incident"
                      title={task.linkedSummary.incident.title}
                      meta={task.linkedSummary.incident.status}
                    />
                  ) : null}
                  {task.linkedSummary?.policy ? (
                    <LinkedSummaryCard
                      label="Related Policy"
                      title={task.linkedSummary.policy.title}
                      meta={task.linkedSummary.policy.status}
                    />
                  ) : null}
                  {task.linkedSummary?.assessment ? (
                    <LinkedSummaryCard
                      label="Related Assessment"
                      title={task.linkedSummary.assessment.type ?? task.linkedSummary.assessment.title}
                      meta={`${task.linkedSummary.assessment.score ?? 0}%`}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </ModulePage>
  );
}

function LinkedSummaryCard({
  label,
  title,
  meta,
}: {
  label: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{meta}</div>
    </div>
  );
}
