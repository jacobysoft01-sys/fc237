"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { BrainCircuit } from "lucide-react";
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

export function AiSystemsPage() {
  const systems = useQuery(api.aiSystems.list) ?? [];
  const controls = useQuery(api.controls.list) ?? [];
  const evidence = useQuery(api.evidence.list) ?? [];
  const vendors = useQuery(api.vendors.list) ?? [];
  const create = useMutation(api.aiSystems.create);
  const [form, setForm] = useState({
    name: "",
    owner: "",
    vendor: "",
    modelOrService: "",
    purpose: "",
    dataSensitivity: "internal",
    riskLevel: "moderate",
    status: "active",
    businessOwner: "",
    technicalOwner: "",
    department: "Operations",
    internalExternalFlag: "external",
    usePurpose: "",
    reviewDate: "",
    personalDataFlags: "customer_contact_data",
    sensitiveDataFlag: true,
    customerFacingFlag: true,
    automatedDecisionFlag: false,
    humanReviewFlag: true,
    businessCriticality: "high",
    approvalStatus: "conditional",
    relatedPolicyId: "",
    relatedVendorEvaluationId: "",
    relatedControlIds: [] as string[],
    relatedEvidenceIds: [] as string[],
    notes: "",
  });

  const coverage = useMemo(() => {
    const approved = systems.filter((system: any) => system.approvalStatus === "approved").length;
    return {
      customerFacing: systems.filter((system: any) => system.customerFacingFlag).length,
      approvalCoverage: systems.length ? Math.round((approved / systems.length) * 100) : 0,
      linkedControls: systems.filter((system: any) => (system.relatedControlIds?.length ?? 0) > 0).length,
    };
  }, [systems]);

  return (
    <ModulePage
      title="AI System Inventory"
      description="Register every AI workflow with ownership, data flags, approval state, and links to the controls, evidence, and vendor review records that support it."
      icon={BrainCircuit}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Registered Systems",
              value: `${systems.length}`,
              detail: "AI-assisted workflows, copilots, or externally hosted services currently tracked.",
              tone: "purple",
            },
            {
              label: "Approval Coverage",
              value: `${coverage.approvalCoverage}%`,
              detail: "Systems with explicit approved status in the register.",
              tone: coverage.approvalCoverage >= 70 ? "green" : "orange",
            },
            {
              label: "Customer Facing",
              value: `${coverage.customerFacing}`,
              detail: "Customer-facing AI systems that should carry stronger vendor and evidence discipline.",
              tone: coverage.customerFacing > 0 ? "orange" : "green",
            },
            {
              label: "Linked Controls",
              value: `${coverage.linkedControls}`,
              detail: "Systems already linked to at least one supporting control record.",
              tone: "green",
            },
          ]}
        />
      }
      formTitle="Add an AI workflow"
      formDescription="Use the register to capture governance context first, then link the supporting controls, evidence, and vendor review."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await create({
              ...form,
              relatedPolicyId: form.relatedPolicyId || undefined,
              relatedVendorEvaluationId: form.relatedVendorEvaluationId || undefined,
              relatedControlIds: form.relatedControlIds.length ? (form.relatedControlIds as any) : undefined,
              relatedEvidenceIds: form.relatedEvidenceIds.length ? (form.relatedEvidenceIds as any) : undefined,
              personalDataFlags: form.personalDataFlags
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            });
            setForm({
              ...form,
              name: "",
              owner: "",
              vendor: "",
              modelOrService: "",
              purpose: "",
              businessOwner: "",
              technicalOwner: "",
              usePurpose: "",
              reviewDate: "",
              notes: "",
              relatedPolicyId: "",
              relatedVendorEvaluationId: "",
              relatedControlIds: [],
              relatedEvidenceIds: [],
            });
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="System name">
              <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </Field>
            <Field label="Business owner">
              <TextInput
                value={form.businessOwner}
                onChange={(event) => setForm({ ...form, businessOwner: event.target.value, owner: event.target.value })}
              />
            </Field>
            <Field label="Technical owner">
              <TextInput
                value={form.technicalOwner}
                onChange={(event) => setForm({ ...form, technicalOwner: event.target.value })}
              />
            </Field>
            <Field label="Vendor">
              <TextInput value={form.vendor} onChange={(event) => setForm({ ...form, vendor: event.target.value })} />
            </Field>
            <Field label="Model or service">
              <TextInput
                value={form.modelOrService}
                onChange={(event) => setForm({ ...form, modelOrService: event.target.value })}
              />
            </Field>
            <Field label="Department">
              <TextInput value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
            </Field>
            <Field label="Internal or external">
              <Select
                options={["internal", "external"]}
                value={form.internalExternalFlag}
                onChange={(value) => setForm({ ...form, internalExternalFlag: value })}
              />
            </Field>
            <Field label="Business criticality">
              <Select
                options={["low", "medium", "high", "critical"]}
                value={form.businessCriticality}
                onChange={(value) => setForm({ ...form, businessCriticality: value })}
              />
            </Field>
            <Field label="Risk level">
              <Select
                options={["low", "moderate", "high", "critical"]}
                value={form.riskLevel}
                onChange={(value) => setForm({ ...form, riskLevel: value })}
              />
            </Field>
            <Field label="Approval status">
              <Select
                options={["draft", "conditional", "approved", "rejected"]}
                value={form.approvalStatus}
                onChange={(value) => setForm({ ...form, approvalStatus: value })}
              />
            </Field>
            <Field label="Review date">
              <TextInput
                type="date"
                value={form.reviewDate}
                onChange={(event) => setForm({ ...form, reviewDate: event.target.value })}
              />
            </Field>
            <Field label="Data sensitivity">
              <Select
                options={["internal", "confidential", "personal", "critical"]}
                value={form.dataSensitivity}
                onChange={(value) => setForm({ ...form, dataSensitivity: value })}
              />
            </Field>
          </div>
          <Field label="Purpose">
            <textarea className={fieldClass} rows={3} value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} />
          </Field>
          <Field label="Use purpose">
            <textarea className={fieldClass} rows={3} value={form.usePurpose} onChange={(event) => setForm({ ...form, usePurpose: event.target.value })} />
          </Field>
          <Field label="Personal data flags" hint="Comma-separated values such as customer_contact_data or employee_records.">
            <TextInput
              value={form.personalDataFlags}
              onChange={(event) => setForm({ ...form, personalDataFlags: event.target.value })}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.customerFacingFlag}
                onChange={(event) => setForm({ ...form, customerFacingFlag: event.target.checked })}
                type="checkbox"
              />
              Customer-facing
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.sensitiveDataFlag}
                onChange={(event) => setForm({ ...form, sensitiveDataFlag: event.target.checked })}
                type="checkbox"
              />
              Sensitive data
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.automatedDecisionFlag}
                onChange={(event) => setForm({ ...form, automatedDecisionFlag: event.target.checked })}
                type="checkbox"
              />
              Automated decision support
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
              <input
                checked={form.humanReviewFlag}
                onChange={(event) => setForm({ ...form, humanReviewFlag: event.target.checked })}
                type="checkbox"
              />
              Human review required
            </label>
          </div>
          <Field label="Link controls" hint="Hold Ctrl or Cmd to select multiple controls.">
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
          <Field label="Link evidence" hint="Optional if evidence already exists for the workflow.">
            <select
              className={`${fieldClass} min-h-28`}
              multiple
              value={form.relatedEvidenceIds}
              onChange={(event) =>
                setForm({
                  ...form,
                  relatedEvidenceIds: Array.from(event.target.selectedOptions).map((option) => option.value),
                })
              }
            >
              {evidence.map((item: any) => (
                <option key={item._id} value={item._id}>
                  {item.title}
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
              <option value="">No vendor evaluation yet</option>
              {vendors.map((vendor: any) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.vendorName} - {vendor.serviceName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes">
            <textarea className={fieldClass} rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </Field>
          <Button type="submit">Add AI system</Button>
        </form>
      }
    >
      <SectionCard title="Registered Systems" description="Use the register as the governance source of truth, not just a list of tools.">
        {systems.length === 0 ? (
          <EmptyState
            title="No AI systems registered"
            message="Start with the systems that touch customer data, external vendors, or business-critical workflows. The action plan will follow from those records."
          />
        ) : (
          <div className="grid gap-4">
            {systems.map((system: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-5" key={system._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{system.name}</h3>
                      <StatusBadge tone={scoreTone(system.riskLevel)}>{system.riskLevel}</StatusBadge>
                      <StatusBadge tone={statusTone(system.approvalStatus ?? system.status)}>{system.approvalStatus ?? system.status}</StatusBadge>
                      {system.customerFacingFlag ? <StatusBadge tone="orange">customer-facing</StatusBadge> : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {system.usePurpose ?? system.purpose}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/30 px-3 py-2 text-sm">
                    <div className="text-xs text-muted-foreground">Review date</div>
                    <div className="mt-1">{system.reviewDate ?? "Not scheduled"}</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Business owner" value={system.businessOwner ?? system.owner} />
                  <InfoCell label="Technical owner" value={system.technicalOwner ?? "Unassigned"} />
                  <InfoCell label="Vendor" value={system.vendor} />
                  <InfoCell label="Department" value={system.department ?? "Not set"} />
                  <InfoCell label="Criticality" value={system.businessCriticality ?? "Not set"} />
                  <InfoCell label="Exposure" value={system.internalExternalFlag ?? "Not set"} />
                  <InfoCell label="Controls linked" value={`${system.relatedControlIds?.length ?? 0}`} />
                  <InfoCell label="Evidence linked" value={`${system.relatedEvidenceIds?.length ?? 0}`} />
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
