"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  Field,
  ModulePage,
  SectionCard,
  SummaryGrid,
  TextInput,
  fieldClass,
  scoreTone,
  statusTone,
} from "@/components/platform/modules/shared";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";

export function VendorsPage() {
  const vendors = useQuery(api.vendors.list) ?? [];
  const aiSystems = useQuery(api.aiSystems.list) ?? [];
  const cloudServices = useQuery(api.cloudServices.list) ?? [];
  const create = useMutation(api.vendors.create);
  const [form, setForm] = useState({
    vendorName: "",
    serviceName: "",
    mfa: 4,
    encryption: 4,
    backup: 3,
    dataLocation: 3,
    support: 3,
    contractClarity: 3,
    complianceDocs: 2,
    accessControl: 3,
    logging: 3,
    incidentSupport: 3,
    vendorCategory: "AI service provider",
    website: "",
    relationshipOwner: "",
    headquarters: "",
    dataHostingLocation: "",
    contractRenewalDate: "",
    dataProcessingAgreement: false,
    subprocessorsDisclosed: false,
    privacyNoticeReviewed: false,
    certifications: "SOC 2",
    documentsReceived: "Terms, SLA",
    outstandingGaps: "DPA",
    relatedAiSystemIds: [] as string[],
    relatedCloudServiceIds: [] as string[],
    evidenceNotes: "",
  });

  const summary = useMemo(() => {
    const weak = vendors.filter((vendor: any) => vendor.score < 50).length;
    const gaps = vendors.filter((vendor: any) => (vendor.evidenceSection?.outstandingGaps?.length ?? 0) > 0).length;
    const averageScore =
      vendors.length > 0 ? Math.round(vendors.reduce((sum: number, vendor: any) => sum + vendor.score, 0) / vendors.length) : 0;
    return { weak, gaps, averageScore };
  }, [vendors]);

  return (
    <ModulePage
      title="Vendor Readiness"
      description="Evaluate identity, security, compliance, and documentation sections together, then link each vendor record to the AI systems and cloud services it supports."
      icon={Building2}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Evaluations",
              value: `${vendors.length}`,
              detail: "Structured vendor records currently stored for the organization.",
              tone: "purple",
            },
            {
              label: "Average Score",
              value: `${summary.averageScore}%`,
              detail: "Calculated from the submitted security and compliance factors.",
              tone: summary.averageScore >= 70 ? "green" : "orange",
            },
            {
              label: "Weak Vendors",
              value: `${summary.weak}`,
              detail: "Weak vendors should generate action items in the action plan.",
              tone: summary.weak > 0 ? "red" : "green",
            },
            {
              label: "Doc Gaps",
              value: `${summary.gaps}`,
              detail: "Records that still carry unresolved documentation gaps.",
              tone: summary.gaps > 0 ? "orange" : "green",
            },
          ]}
        />
      }
      formTitle="Submit vendor evaluation"
      formDescription="Score the provider, document what was reviewed, and capture any gaps that still need closure."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await create({
              ...form,
              certifications: form.certifications.split(",").map((item) => item.trim()).filter(Boolean),
              documentsReceived: form.documentsReceived.split(",").map((item) => item.trim()).filter(Boolean),
              outstandingGaps: form.outstandingGaps.split(",").map((item) => item.trim()).filter(Boolean),
              relatedAiSystemIds: form.relatedAiSystemIds.length ? (form.relatedAiSystemIds as any) : undefined,
              relatedCloudServiceIds: form.relatedCloudServiceIds.length ? (form.relatedCloudServiceIds as any) : undefined,
            });
            setForm({
              ...form,
              vendorName: "",
              serviceName: "",
              website: "",
              relationshipOwner: "",
              headquarters: "",
              dataHostingLocation: "",
              contractRenewalDate: "",
              evidenceNotes: "",
              relatedAiSystemIds: [],
              relatedCloudServiceIds: [],
            });
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vendor name">
              <TextInput value={form.vendorName} onChange={(event) => setForm({ ...form, vendorName: event.target.value })} />
            </Field>
            <Field label="Service name">
              <TextInput value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} />
            </Field>
            <Field label="Relationship owner">
              <TextInput
                value={form.relationshipOwner}
                onChange={(event) => setForm({ ...form, relationshipOwner: event.target.value })}
              />
            </Field>
            <Field label="Contract renewal">
              <TextInput
                type="date"
                value={form.contractRenewalDate}
                onChange={(event) => setForm({ ...form, contractRenewalDate: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(["mfa", "encryption", "backup", "dataLocation", "support", "contractClarity", "complianceDocs", "accessControl", "logging", "incidentSupport"] as const).map((key) => (
              <Field key={key} label={`${key.replace(/([A-Z])/g, " $1")} (${form[key]}/5)`}>
                <input
                  className="w-full accent-primary"
                  max={5}
                  min={1}
                  type="range"
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: Number(event.target.value) })}
                />
              </Field>
            ))}
          </div>
          <Field label="Certifications">
            <TextInput value={form.certifications} onChange={(event) => setForm({ ...form, certifications: event.target.value })} />
          </Field>
          <Field label="Documents received">
            <TextInput
              value={form.documentsReceived}
              onChange={(event) => setForm({ ...form, documentsReceived: event.target.value })}
            />
          </Field>
          <Field label="Outstanding gaps">
            <TextInput value={form.outstandingGaps} onChange={(event) => setForm({ ...form, outstandingGaps: event.target.value })} />
          </Field>
          <Field label="Link AI systems">
            <select
              className={`${fieldClass} min-h-24`}
              multiple
              value={form.relatedAiSystemIds}
              onChange={(event) =>
                setForm({
                  ...form,
                  relatedAiSystemIds: Array.from(event.target.selectedOptions).map((option) => option.value),
                })
              }
            >
              {aiSystems.map((system: any) => (
                <option key={system._id} value={system._id}>
                  {system.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Link cloud services">
            <select
              className={`${fieldClass} min-h-24`}
              multiple
              value={form.relatedCloudServiceIds}
              onChange={(event) =>
                setForm({
                  ...form,
                  relatedCloudServiceIds: Array.from(event.target.selectedOptions).map((option) => option.value),
                })
              }
            >
              {cloudServices.map((service: any) => (
                <option key={service._id} value={service._id}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Evidence notes">
            <textarea className={fieldClass} rows={4} value={form.evidenceNotes} onChange={(event) => setForm({ ...form, evidenceNotes: event.target.value })} />
          </Field>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.dataProcessingAgreement}
                onChange={(event) => setForm({ ...form, dataProcessingAgreement: event.target.checked })}
                type="checkbox"
              />
              DPA received
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.subprocessorsDisclosed}
                onChange={(event) => setForm({ ...form, subprocessorsDisclosed: event.target.checked })}
                type="checkbox"
              />
              Subprocessors disclosed
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.privacyNoticeReviewed}
                onChange={(event) => setForm({ ...form, privacyNoticeReviewed: event.target.checked })}
                type="checkbox"
              />
              Privacy notice reviewed
            </label>
          </div>
          <Button type="submit">Save vendor evaluation</Button>
        </form>
      }
    >
      <SectionCard title="Vendor Records" description="Weak scores and unresolved gaps should feed directly into the action plan and dashboard.">
        {vendors.length === 0 ? (
          <EmptyState
            title="No vendor evaluations yet"
            message="Start with the vendors that handle customer data, provide AI capabilities, or support critical cloud workflows."
          />
        ) : (
          <div className="grid gap-4">
            {vendors.map((vendor: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={vendor._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{vendor.vendorName}</h3>
                      <StatusBadge tone={scoreTone(vendor.classification)}>{vendor.classification}</StatusBadge>
                      {(vendor.evidenceSection?.outstandingGaps?.length ?? 0) > 0 ? <StatusBadge tone="orange">documentation gap</StatusBadge> : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{vendor.evidenceNotes}</p>
                  </div>
                  <div className="w-48 rounded-xl bg-muted/35 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Score</span>
                      <span>{vendor.score}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressLine value={vendor.score} tone={vendor.score >= 70 ? "green" : vendor.score >= 45 ? "orange" : "red"} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Service" value={vendor.serviceName} />
                  <InfoCell label="Owner" value={vendor.identity?.relationshipOwner ?? "Unassigned"} />
                  <InfoCell label="AI links" value={`${vendor.relatedAiSystemIds?.length ?? 0}`} />
                  <InfoCell label="Cloud links" value={`${vendor.relatedCloudServiceIds?.length ?? 0}`} />
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
