"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { MessageSquareWarning } from "lucide-react";
import { useMemo, useState } from "react";

import { toIdArray, toOptionalId } from "@/components/platform/modules/id-helpers";
import {
  EmptyState,
  Field,
  ModulePage,
  SectionCard,
  Select,
  SummaryGrid,
  TextInput,
  scoreTone,
  statusTone,
} from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

export function IncidentsPage() {
  const incidents = useQuery(api.incidents.list) ?? [];
  const policies = useQuery(api.policies.list) ?? [];
  const controls = useQuery(api.controls.list) ?? [];
  const create = useMutation(api.incidents.create);
  const updateStatus = useMutation(api.incidents.updateStatus);
  const [form, setForm] = useState({
    title: "",
    category: "suspicious login",
    severity: "medium",
    detectedAt: new Date().toISOString().slice(0, 10),
    owner: "",
    relatedPolicyId: "",
    relatedControlIds: [] as string[],
  });

  const summary = useMemo(() => {
    const unresolved = incidents.filter((incident: any) => !["resolved", "closed"].includes(incident.status)).length;
    return {
      unresolved,
      critical: incidents.filter((incident: any) => incident.severity === "critical").length,
      escalated: incidents.filter((incident: any) => incident.escalationRecommended).length,
    };
  }, [incidents]);

  return (
    <ModulePage
      title="Incident Readiness"
      description="Capture incident records, keep response guidance visible, and link each case to the policy and controls that should have supported the response."
      icon={MessageSquareWarning}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Incidents",
              value: `${incidents.length}`,
              detail: "Recorded events, drills, or real cases currently in the workspace.",
              tone: "purple",
            },
            {
              label: "Unresolved",
              value: `${summary.unresolved}`,
              detail: "Cases still open, monitoring, or otherwise incomplete.",
              tone: summary.unresolved > 0 ? "orange" : "green",
            },
            {
              label: "Critical",
              value: `${summary.critical}`,
              detail: "Incidents that should trigger the strongest escalation path.",
              tone: summary.critical > 0 ? "red" : "green",
            },
            {
              label: "Escalation Flag",
              value: `${summary.escalated}`,
              detail: "Cases where the platform recommends escalation support.",
              tone: summary.escalated > 0 ? "orange" : "green",
            },
          ]}
        />
      }
      formTitle="Record an incident"
      formDescription="A light incident log is enough for Phase 1 as long as it captures scope, response timing, and linked policy/control context."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await create({
              ...form,
              relatedPolicyId: toOptionalId<"policies">(form.relatedPolicyId),
              relatedControlIds: toIdArray<"controls">(form.relatedControlIds),
            });
            setForm({
              ...form,
              title: "",
              owner: "",
              relatedPolicyId: "",
              relatedControlIds: [],
            });
          }}
        >
          <Field label="Incident title">
            <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <Select
                options={["phishing", "suspicious login", "hacked cloud account", "hacked email account", "ransomware", "data leakage", "website compromise"]}
                value={form.category}
                onChange={(value) => setForm({ ...form, category: value })}
              />
            </Field>
            <Field label="Severity">
              <Select
                options={["low", "medium", "high", "critical"]}
                value={form.severity}
                onChange={(value) => setForm({ ...form, severity: value })}
              />
            </Field>
            <Field label="Detected at">
              <TextInput type="date" value={form.detectedAt} onChange={(event) => setForm({ ...form, detectedAt: event.target.value })} />
            </Field>
            <Field label="Owner">
              <TextInput value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
            </Field>
          </div>
          <Field label="Related policy">
            <select className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.relatedPolicyId} onChange={(event) => setForm({ ...form, relatedPolicyId: event.target.value })}>
              <option value="">No policy selected</option>
              {policies.map((policy: any) => (
                <option key={policy._id} value={policy._id}>
                  {policy.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Related controls">
            <select
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          <Button type="submit">Record incident</Button>
        </form>
      }
    >
      <SectionCard title="Incident Log" description="Use the cards to keep closure state and evidence discipline visible.">
        {incidents.length === 0 ? (
          <EmptyState
            title="No incidents recorded"
            message="Even a tabletop exercise or suspicious login review is useful here because it strengthens the incident readiness score and evidence trail."
          />
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={incident._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{incident.title}</h3>
                      <StatusBadge tone={scoreTone(incident.severity)}>{incident.severity}</StatusBadge>
                      <StatusBadge tone={statusTone(incident.status)}>{incident.status}</StatusBadge>
                      {incident.escalationRecommended ? <StatusBadge tone="red">escalate</StatusBadge> : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{incident.responseActions.join(" | ")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {incident.status !== "resolved" ? (
                      <Button
                        onClick={() =>
                          updateStatus({
                            incidentId: incident._id,
                            status: "resolved",
                            resolvedAt: new Date().toISOString().slice(0, 10),
                            resolutionSummary: "Resolved from the incident log.",
                          })
                        }
                        size="sm"
                      >
                        Resolve
                      </Button>
                    ) : null}
                    {incident.status !== "monitoring" ? (
                      <Button onClick={() => updateStatus({ incidentId: incident._id, status: "monitoring" })} size="sm" variant="outline">
                        Monitor
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Detected" value={incident.detectedAt} />
                  <InfoCell label="Owner" value={incident.owner ?? "Unassigned"} />
                  <InfoCell label="Controls linked" value={`${incident.relatedControlIds?.length ?? 0}`} />
                  <InfoCell label="Resolved at" value={incident.resolvedAt ?? "Not resolved"} />
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
