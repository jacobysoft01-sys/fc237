"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { Archive } from "lucide-react";
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

export function EvidencePage() {
  const evidence = useQuery(api.evidence.list) ?? [];
  const controls = useQuery(api.controls.list) ?? [];
  const risks = useQuery(api.risks.list) ?? [];
  const vendors = useQuery(api.vendors.list) ?? [];
  const policies = useQuery(api.policies.list) ?? [];
  const incidents = useQuery(api.incidents.list) ?? [];
  const aiSystems = useQuery(api.aiSystems.list) ?? [];
  const generateUploadUrl = useMutation(api.evidence.generateUploadUrl);
  const create = useMutation(api.evidence.create);
  const updateReviewStatus = useMutation(api.evidence.updateReviewStatus);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    evidenceType: "MFA screenshot",
    controlId: "",
    relatedRiskId: "",
    relatedVendorEvaluationId: "",
    relatedPolicyId: "",
    relatedIncidentId: "",
    relatedAiSystemId: "",
    status: "submitted",
    reviewNotes: "",
    submittedBy: "",
    reviewer: "",
    expiryDate: "",
    reviewDate: "",
    reviewerComment: "",
  });

  const summary = useMemo(() => {
    const accepted = evidence.filter((item: any) => item.status === "accepted").length;
    const pending = evidence.filter((item: any) => ["pending", "submitted"].includes(item.status)).length;
    const expired = evidence.filter((item: any) => item.status === "expired").length;
    return { accepted, pending, expired };
  }, [evidence]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let fileStorageId: string | undefined;
    if (file) {
      const uploadUrl = await generateUploadUrl({});
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const json = await result.json();
      fileStorageId = json.storageId;
    }

    await create({
      title: form.title,
      evidenceType: form.evidenceType,
      controlId: form.controlId || undefined,
      relatedRiskId: form.relatedRiskId || undefined,
      relatedVendorEvaluationId: form.relatedVendorEvaluationId || undefined,
      relatedPolicyId: form.relatedPolicyId || undefined,
      relatedIncidentId: form.relatedIncidentId || undefined,
      relatedAiSystemId: form.relatedAiSystemId || undefined,
      fileStorageId,
      fileName: file?.name,
      status: form.status,
      reviewNotes: form.reviewNotes,
      submittedBy: form.submittedBy || undefined,
      reviewer: form.reviewer || undefined,
      expiryDate: form.expiryDate || undefined,
      reviewDate: form.reviewDate || undefined,
      reviewerComment: form.reviewerComment || undefined,
    });

    setForm({
      ...form,
      title: "",
      controlId: "",
      relatedRiskId: "",
      relatedVendorEvaluationId: "",
      relatedPolicyId: "",
      relatedIncidentId: "",
      relatedAiSystemId: "",
      reviewNotes: "",
      submittedBy: "",
      reviewer: "",
      expiryDate: "",
      reviewDate: "",
      reviewerComment: "",
    });
    setFile(null);
  }

  return (
    <ModulePage
      title="Evidence Vault"
      description="Evidence is the operating proof layer for Phase 1. Link every artifact to the control first, then add any secondary risk, vendor, policy, incident, or AI-system context."
      icon={Archive}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Evidence Records",
              value: `${evidence.length}`,
              detail: "Stored platform artifacts, screenshots, policies, and review records.",
              tone: "purple",
            },
            {
              label: "Accepted",
              value: `${summary.accepted}`,
              detail: "Evidence items already accepted by a reviewer.",
              tone: "green",
            },
            {
              label: "Pending",
              value: `${summary.pending}`,
              detail: "Submitted or pending items that still need reviewer attention.",
              tone: summary.pending > 0 ? "orange" : "green",
            },
            {
              label: "Expired",
              value: `${summary.expired}`,
              detail: "Expired items should trigger refresh tasks automatically.",
              tone: summary.expired > 0 ? "red" : "green",
            },
          ]}
        />
      }
      formTitle="Add linked evidence"
      formDescription="Treat each upload or record as a proof object that should strengthen dashboard scoring and reduce follow-up work."
      form={
        <form className="grid gap-4" onSubmit={submit}>
          <Field label="Evidence title">
            <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Evidence type">
              <Select
                options={["MFA screenshot", "Access review sheet", "Backup log", "Vendor evaluation form", "Incident log", "Policy approval note", "Generated report"]}
                value={form.evidenceType}
                onChange={(value) => setForm({ ...form, evidenceType: value })}
              />
            </Field>
            <Field label="Status">
              <Select
                options={["pending", "submitted", "accepted", "rejected", "expired"]}
                value={form.status}
                onChange={(value) => setForm({ ...form, status: value })}
              />
            </Field>
          </div>
          <Field label="Primary control link">
            <select className={fieldClass} value={form.controlId} onChange={(event) => setForm({ ...form, controlId: event.target.value })}>
              <option value="">No control selected</option>
              {controls.map((control: any) => (
                <option key={control._id} value={control._id}>
                  {control.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Related risk">
              <select className={fieldClass} value={form.relatedRiskId} onChange={(event) => setForm({ ...form, relatedRiskId: event.target.value })}>
                <option value="">No risk selected</option>
                {risks.map((risk: any) => (
                  <option key={risk._id} value={risk._id}>
                    {risk.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Related vendor">
              <select
                className={fieldClass}
                value={form.relatedVendorEvaluationId}
                onChange={(event) => setForm({ ...form, relatedVendorEvaluationId: event.target.value })}
              >
                <option value="">No vendor selected</option>
                {vendors.map((vendor: any) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Related policy">
              <select className={fieldClass} value={form.relatedPolicyId} onChange={(event) => setForm({ ...form, relatedPolicyId: event.target.value })}>
                <option value="">No policy selected</option>
                {policies.map((policy: any) => (
                  <option key={policy._id} value={policy._id}>
                    {policy.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Related incident">
              <select
                className={fieldClass}
                value={form.relatedIncidentId}
                onChange={(event) => setForm({ ...form, relatedIncidentId: event.target.value })}
              >
                <option value="">No incident selected</option>
                {incidents.map((incident: any) => (
                  <option key={incident._id} value={incident._id}>
                    {incident.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Related AI system">
              <select
                className={fieldClass}
                value={form.relatedAiSystemId}
                onChange={(event) => setForm({ ...form, relatedAiSystemId: event.target.value })}
              >
                <option value="">No AI system selected</option>
                {aiSystems.map((system: any) => (
                  <option key={system._id} value={system._id}>
                    {system.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="File">
              <input className={fieldClass} type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Submitted by">
              <TextInput value={form.submittedBy} onChange={(event) => setForm({ ...form, submittedBy: event.target.value })} />
            </Field>
            <Field label="Reviewer">
              <TextInput value={form.reviewer} onChange={(event) => setForm({ ...form, reviewer: event.target.value })} />
            </Field>
            <Field label="Expiry date">
              <TextInput type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} />
            </Field>
            <Field label="Review date">
              <TextInput type="date" value={form.reviewDate} onChange={(event) => setForm({ ...form, reviewDate: event.target.value })} />
            </Field>
          </div>
          <Field label="Review notes">
            <textarea className={fieldClass} rows={3} value={form.reviewNotes} onChange={(event) => setForm({ ...form, reviewNotes: event.target.value })} />
          </Field>
          <Field label="Reviewer comment">
            <textarea className={fieldClass} rows={3} value={form.reviewerComment} onChange={(event) => setForm({ ...form, reviewerComment: event.target.value })} />
          </Field>
          <Button type="submit">Add evidence</Button>
        </form>
      }
    >
      <SectionCard title="Evidence Register" description="Review evidence lifecycle in place and keep expiry-driven refresh work visible.">
        {evidence.length === 0 ? (
          <EmptyState
            title="No evidence linked yet"
            message="Start with MFA, backup, vendor review, policy approval, and incident records. Those are the fastest ways to improve dashboard scoring."
          />
        ) : (
          <div className="grid gap-4">
            {evidence.map((item: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={item._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>
                      {item.fileName ? <StatusBadge tone="purple">{item.fileName}</StatusBadge> : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.reviewNotes ?? "No review notes recorded."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.status !== "accepted" ? (
                      <Button
                        onClick={() =>
                          updateReviewStatus({
                            evidenceId: item._id,
                            status: "accepted",
                            reviewer: item.reviewer ?? "Platform reviewer",
                            reviewDate: new Date().toISOString().slice(0, 10),
                            reviewerComment: "Accepted from the evidence register.",
                          })
                        }
                        size="sm"
                      >
                        Accept
                      </Button>
                    ) : null}
                    {item.status !== "rejected" ? (
                      <Button
                        onClick={() =>
                          updateReviewStatus({
                            evidenceId: item._id,
                            status: "rejected",
                            reviewer: item.reviewer ?? "Platform reviewer",
                            reviewDate: new Date().toISOString().slice(0, 10),
                            reviewerComment: "Rejected from the evidence register.",
                          })
                        }
                        size="sm"
                        variant="outline"
                      >
                        Reject
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Type" value={item.evidenceType} />
                  <InfoCell label="Reviewer" value={item.reviewer ?? "Unassigned"} />
                  <InfoCell label="Review date" value={item.reviewDate ?? "Not reviewed"} />
                  <InfoCell label="Expiry" value={item.expiryDate ?? "No expiry"} />
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
