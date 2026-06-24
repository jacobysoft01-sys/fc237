"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Gauge } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  Field,
  ModulePage,
  SectionCard,
  Select,
  SummaryGrid,
  TextInput,
  fieldClass,
  scoreTone,
  statusTone,
} from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

export function RisksPage({ aiOnly = false }: { aiOnly?: boolean }) {
  const allRisks = useQuery(api.risks.list) ?? [];
  const aiSystems = useQuery(api.aiSystems.list) ?? [];
  const controls = useQuery(api.controls.list) ?? [];
  const vendors = useQuery(api.vendors.list) ?? [];
  const create = useMutation(api.risks.create);
  const [levelFilter, setLevelFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    category: aiOnly ? "ai" : "technical",
    likelihood: 3,
    impact: 3,
    owner: "",
    remediationStatus: "Not started",
    description: "",
    rootCause: "",
    dueDate: "",
    treatmentOption: "mitigate",
    status: "open",
    requiredEvidenceSummary: "",
    relatedAiSystemId: "",
    relatedVendorEvaluationId: "",
    relatedControlIds: [] as string[],
  });

  const risks = useMemo(
    () =>
      allRisks
        .filter((risk: any) => (aiOnly ? risk.category === "ai" : true))
        .filter((risk: any) => (levelFilter === "all" ? true : risk.riskLevel === levelFilter)),
    [allRisks, aiOnly, levelFilter],
  );

  const summary = useMemo(() => {
    const scoped = allRisks.filter((risk: any) => (aiOnly ? risk.category === "ai" : true));
    const urgent = scoped.filter((risk: any) => ["high", "critical"].includes(risk.riskLevel));
    return {
      total: scoped.length,
      urgent: urgent.length,
      linkedControls: scoped.filter((risk: any) => (risk.relatedControlIds?.length ?? 0) > 0).length,
    };
  }, [allRisks, aiOnly]);

  return (
    <ModulePage
      title={aiOnly ? "AI Risk Assessments" : "Risk Management"}
      description={
        aiOnly
          ? "Track customer-data, vendor, approval, and operational AI risks with linked systems, controls, and evidence expectations."
          : "Score risks with FC237 likelihood x impact, then assign treatment, due dates, evidence expectations, and linked controls."
      }
      icon={aiOnly ? AlertTriangle : Gauge}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Tracked Risks",
              value: `${summary.total}`,
              detail: aiOnly ? "AI-scoped risks in the current register." : "All cloud, governance, vendor, and AI risks in scope.",
              tone: "purple",
            },
            {
              label: "High or Critical",
              value: `${summary.urgent}`,
              detail: "These records should generate or refresh action items automatically.",
              tone: summary.urgent > 0 ? "red" : "green",
            },
            {
              label: "Linked Controls",
              value: `${summary.linkedControls}`,
              detail: "Risks already linked to at least one mitigating control.",
              tone: "green",
            },
            {
              label: "Filter",
              value: levelFilter === "all" ? "All Levels" : levelFilter,
              detail: "Use the list filter to focus on urgent treatment work.",
            },
          ]}
        />
      }
      formTitle="Create a scored risk"
      formDescription="High and critical risks should include a due date, treatment option, and at least one linked control."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await create({
              ...form,
              relatedAiSystemId: form.relatedAiSystemId || undefined,
              relatedVendorEvaluationId: form.relatedVendorEvaluationId || undefined,
              relatedControlIds: form.relatedControlIds.length ? (form.relatedControlIds as any) : undefined,
            });
            setForm({
              ...form,
              title: "",
              owner: "",
              remediationStatus: "Not started",
              description: "",
              rootCause: "",
              dueDate: "",
              requiredEvidenceSummary: "",
              relatedAiSystemId: "",
              relatedVendorEvaluationId: "",
              relatedControlIds: [],
            });
          }}
        >
          <Field label="Risk title">
            <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className={fieldClass} rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
          <Field label="Root cause">
            <textarea className={fieldClass} rows={3} value={form.rootCause} onChange={(event) => setForm({ ...form, rootCause: event.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <Select
                options={["technical", "governance", "compliance", "vendor", "human_operational", "ai"]}
                value={form.category}
                onChange={(value) => setForm({ ...form, category: value })}
              />
            </Field>
            <Field label="Owner">
              <TextInput value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
            </Field>
            <Field label="Likelihood">
              <Select
                options={["1", "2", "3", "4", "5"]}
                value={String(form.likelihood)}
                onChange={(value) => setForm({ ...form, likelihood: Number(value) })}
              />
            </Field>
            <Field label="Impact">
              <Select
                options={["1", "2", "3", "4", "5"]}
                value={String(form.impact)}
                onChange={(value) => setForm({ ...form, impact: Number(value) })}
              />
            </Field>
            <Field label="Treatment option">
              <Select
                options={["mitigate", "accept", "transfer", "avoid"]}
                value={form.treatmentOption}
                onChange={(value) => setForm({ ...form, treatmentOption: value })}
              />
            </Field>
            <Field label="Due date">
              <TextInput type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            </Field>
          </div>
          <Field label="Required evidence summary">
            <TextInput
              value={form.requiredEvidenceSummary}
              onChange={(event) => setForm({ ...form, requiredEvidenceSummary: event.target.value })}
            />
          </Field>
          <Field label="Link AI system">
            <select
              className={fieldClass}
              value={form.relatedAiSystemId}
              onChange={(event) => setForm({ ...form, relatedAiSystemId: event.target.value })}
            >
              <option value="">No AI system linked</option>
              {aiSystems.map((system: any) => (
                <option key={system._id} value={system._id}>
                  {system.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Link controls" hint="Hold Ctrl or Cmd to select multiple mitigating controls.">
            <select
              className={`${fieldClass} min-h-28`}
              multiple
              value={form.relatedControlIds}
              onChange={(event) =>
                setForm({
                  ...form,
                  relatedControlIds: Array.from(event.target.selectedOptions).map((option) => option.value),
                })
              }
            >
              {controls.map((control: any) => (
                <option key={control._id} value={control._id}>
                  {control.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Link vendor evaluation">
            <select
              className={fieldClass}
              value={form.relatedVendorEvaluationId}
              onChange={(event) => setForm({ ...form, relatedVendorEvaluationId: event.target.value })}
            >
              <option value="">No vendor linked</option>
              {vendors.map((vendor: any) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.vendorName} - {vendor.serviceName}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit">Add scored risk</Button>
        </form>
      }
    >
      <SectionCard title="Risk Register" description="Use the filters to isolate urgent treatment work before the next review or report.">
        <div className="mb-4 flex flex-wrap gap-2">
          {["all", "critical", "high", "moderate", "low"].map((level) => (
            <button
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${levelFilter === level ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}
              key={level}
              onClick={() => setLevelFilter(level)}
              type="button"
            >
              {level}
            </button>
          ))}
        </div>
        {risks.length === 0 ? (
          <EmptyState
            title="No risks match the current view"
            message="Create the first scored risk or widen the level filter. High and critical items will immediately influence the dashboard and action plan."
          />
        ) : (
          <div className="grid gap-4">
            {risks.map((risk: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={risk._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{risk.title}</h3>
                      <StatusBadge tone={scoreTone(risk.riskLevel)}>{risk.riskLevel}</StatusBadge>
                      <StatusBadge tone={statusTone(risk.status ?? "open")}>{(risk.status ?? "open").replaceAll("_", " ")}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{risk.description ?? risk.remediationStatus}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 px-3 py-2 text-sm">
                    {risk.likelihood} x {risk.impact} = {risk.riskScore}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Owner" value={risk.owner} />
                  <InfoCell label="Treatment" value={risk.treatmentOption ?? risk.treatmentStatus} />
                  <InfoCell label="Due date" value={risk.dueDate ?? "Not scheduled"} />
                  <InfoCell label="Controls linked" value={`${risk.relatedControlIds?.length ?? 0}`} />
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
