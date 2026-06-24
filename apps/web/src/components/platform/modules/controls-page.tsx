"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { ListChecks } from "lucide-react";

import { EmptyState, ModulePage, SectionCard, SummaryGrid, statusTone } from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

export function ControlsPage() {
  const controls = useQuery(api.controls.list) ?? [];
  const evidence = useQuery(api.evidence.list) ?? [];
  const updateStatus = useMutation(api.controls.updateStatus);
  const implemented = controls.filter((control: any) => control.implementationStatus === "implemented").length;
  const requiredEvidence = controls.filter((control: any) => control.evidenceRequired).length;
  const linkedEvidence = new Set(evidence.filter((item: any) => item.controlId).map((item: any) => item.controlId));

  return (
    <ModulePage
      title="Controls Library"
      description="Controls stay central in Phase 1. Risks, evidence, vendors, incidents, and action items point into this library instead of maintaining duplicate back-reference structures."
      icon={ListChecks}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Controls",
              value: `${controls.length}`,
              detail: "Seeded and user-updated controls in the FC237 library.",
              tone: "purple",
            },
            {
              label: "Implemented",
              value: `${implemented}`,
              detail: "Controls that currently report implemented status.",
              tone: implemented > 0 ? "green" : "orange",
            },
            {
              label: "Evidence Required",
              value: `${requiredEvidence}`,
              detail: "Controls that expect a linked evidence slot in the vault.",
              tone: "orange",
            },
            {
              label: "Evidence Linked",
              value: `${linkedEvidence.size}`,
              detail: "Unique controls already carrying at least one evidence record.",
              tone: linkedEvidence.size >= requiredEvidence ? "green" : "orange",
            },
          ]}
        />
      }
      form={null}
    >
      <SectionCard title="Control Cards" description="Update status in place and use the descriptions as the platform's implementation guidance.">
        {controls.length === 0 ? (
          <EmptyState
            title="No controls loaded"
            message="Controls are seeded during onboarding. If this space is empty, start by creating the organization profile so the baseline library can be generated."
          />
        ) : (
          <div className="grid gap-4">
            {controls.map((control: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={control._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{control.name}</h3>
                      <StatusBadge tone="purple">{control.domain ?? control.pillar}</StatusBadge>
                      <StatusBadge tone={statusTone(control.implementationStatus)}>{control.implementationStatus.replaceAll("_", " ")}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{control.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Evidence requirement: {control.requiredEvidenceDescription ?? "Link an artifact that proves design or operation."}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Framework mapping: {control.frameworkMappings.join(", ")}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {["not_started", "in_progress", "implemented", "not_applicable"].map((status) => (
                      <Button
                        key={status}
                        onClick={() => updateStatus({ controlId: control._id, implementationStatus: status })}
                        size="sm"
                        type="button"
                        variant={control.implementationStatus === status ? "default" : "outline"}
                      >
                        {status.replaceAll("_", " ")}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Owner" value={control.owner ?? "Unassigned"} />
                  <InfoCell label="Due date" value={control.dueDate ?? "No date set"} />
                  <InfoCell label="Priority" value={control.priority} />
                  <InfoCell label="Evidence linked" value={linkedEvidence.has(control._id) ? "Yes" : "No"} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </ModulePage>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/35 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
