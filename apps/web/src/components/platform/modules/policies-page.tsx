"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { LockKeyhole } from "lucide-react";
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
  statusTone,
} from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

const policyTypeOptions = [
  "incident_response",
  "access_control",
  "backup_recovery",
  "data_governance",
  "vendor_management",
  "ai_usage",
];

export function PoliciesPage() {
  const policies = useQuery(api.policies.list) ?? [];
  const controls = useQuery(api.controls.list) ?? [];
  const create = useMutation(api.policies.create);
  const updateStatus = useMutation(api.policies.updateStatus);
  const [form, setForm] = useState({
    title: "",
    type: "ai_usage",
    status: "draft",
    owner: "",
    reviewDate: "",
    priority: "high",
    summary: "",
    templateKey: "ai_usage",
    effectiveDate: "",
    expiryDate: "",
    approvedAt: "",
    relatedControlIds: [] as string[],
  });

  const summary = useMemo(() => {
    const approved = policies.filter((policy: any) => policy.status === "approved").length;
    const draft = policies.filter((policy: any) => policy.status === "draft").length;
    const expired = policies.filter((policy: any) => policy.expiryDate && policy.expiryDate < new Date().toISOString().slice(0, 10)).length;
    return { approved, draft, expired };
  }, [policies]);

  return (
    <ModulePage
      title="Policy Center"
      description="Keep Phase 1 policies lighter than the core modules, but structured enough to drive maturity scoring, incident linkage, evidence review, and action generation."
      icon={LockKeyhole}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Policies",
              value: `${policies.length}`,
              detail: "Policy records currently tracked in the organization.",
              tone: "purple",
            },
            {
              label: "Approved",
              value: `${summary.approved}`,
              detail: "Policies currently in approved state.",
              tone: summary.approved > 0 ? "green" : "orange",
            },
            {
              label: "Draft",
              value: `${summary.draft}`,
              detail: "Draft policies should surface in the action plan when priority is high.",
              tone: summary.draft > 0 ? "orange" : "green",
            },
            {
              label: "Expired",
              value: `${summary.expired}`,
              detail: "Expired policies directly reduce policy maturity.",
              tone: summary.expired > 0 ? "red" : "green",
            },
          ]}
        />
      }
      formTitle="Create or register a policy"
      formDescription="Use template-oriented policy records in Phase 1 so the assistant can recommend the right next steps without needing free-form generation."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await create({
              ...form,
              effectiveDate: form.effectiveDate || undefined,
              expiryDate: form.expiryDate || undefined,
              approvedAt: form.approvedAt || undefined,
              relatedControlIds: form.relatedControlIds.length ? (form.relatedControlIds as any) : undefined,
            });
            setForm({
              ...form,
              title: "",
              owner: "",
              reviewDate: "",
              summary: "",
              effectiveDate: "",
              expiryDate: "",
              approvedAt: "",
              relatedControlIds: [],
            });
          }}
        >
          <Field label="Policy title">
            <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Type">
              <Select options={policyTypeOptions} value={form.type} onChange={(value) => setForm({ ...form, type: value, templateKey: value })} />
            </Field>
            <Field label="Status">
              <Select options={["draft", "in_review", "approved", "retired"]} value={form.status} onChange={(value) => setForm({ ...form, status: value })} />
            </Field>
            <Field label="Owner">
              <TextInput value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
            </Field>
            <Field label="Priority">
              <Select options={["critical", "high", "medium", "low"]} value={form.priority} onChange={(value) => setForm({ ...form, priority: value })} />
            </Field>
            <Field label="Review date">
              <TextInput type="date" value={form.reviewDate} onChange={(event) => setForm({ ...form, reviewDate: event.target.value })} />
            </Field>
            <Field label="Expiry date">
              <TextInput type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} />
            </Field>
          </div>
          <Field label="Summary">
            <textarea className={fieldClass} rows={3} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
          </Field>
          <Field label="Related controls">
            <select
              className={`${fieldClass} min-h-24`}
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
          <Button type="submit">Save policy record</Button>
        </form>
      }
    >
      <SectionCard title="Policy Register" description="Keep approval state, review dates, and linked controls visible so policy maturity scores can stay data-backed.">
        {policies.length === 0 ? (
          <EmptyState
            title="No policies registered"
            message="Create the first priority policy type, or use the seeded workspace to review draft and approved records."
          />
        ) : (
          <div className="grid gap-4">
            {policies.map((policy: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={policy._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{policy.title}</h3>
                      <StatusBadge tone={statusTone(policy.status)}>{policy.status.replaceAll("_", " ")}</StatusBadge>
                      <StatusBadge tone="purple">{policy.type.replaceAll("_", " ")}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{policy.summary ?? "Template-based Phase 1 policy record."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {policy.status !== "approved" ? (
                      <Button
                        onClick={() =>
                          updateStatus({
                            policyId: policy._id,
                            status: "approved",
                            approvedAt: new Date().toISOString().slice(0, 10),
                            reviewDate: policy.reviewDate,
                            expiryDate: policy.expiryDate,
                          })
                        }
                        size="sm"
                      >
                        Approve
                      </Button>
                    ) : null}
                    {policy.status !== "in_review" ? (
                      <Button onClick={() => updateStatus({ policyId: policy._id, status: "in_review", reviewDate: policy.reviewDate, expiryDate: policy.expiryDate })} size="sm" variant="outline">
                        Move to review
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Owner" value={policy.owner} />
                  <InfoCell label="Priority" value={policy.priority ?? "Not set"} />
                  <InfoCell label="Review date" value={policy.reviewDate} />
                  <InfoCell label="Controls linked" value={`${policy.relatedControlIds?.length ?? 0}`} />
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
