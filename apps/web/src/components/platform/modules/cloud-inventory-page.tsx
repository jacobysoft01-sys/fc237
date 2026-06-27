"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { Server } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  EmptyState,
  Field,
  LinkedRecordStack,
  ModulePage,
  SectionCard,
  SummaryGrid,
  TextInput,
  fieldClass,
} from "@/components/platform/modules/shared";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";

function percent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

function serviceCompleteness(service: any) {
  const checks = [service.serviceName, service.providerName, service.serviceModel, service.purpose, service.dataStored, service.owner];
  const complete = checks.filter((value) => typeof value === "string" && value.trim().length > 0).length;
  return percent(complete, checks.length);
}

export function CloudInventoryPage() {
  const cloudServices = useQuery(api.cloudServices.list) ?? [];
  const vendors = useQuery(api.vendors.list) ?? [];
  const risks = useQuery(api.risks.list) ?? [];
  const create = useMutation(api.cloudServices.create);
  const update = useMutation(api.cloudServices.update);

  const [form, setForm] = useState({
    serviceName: "",
    providerName: "",
    serviceModel: "SaaS",
    purpose: "",
    dataStored: "",
    owner: "",
    approved: false,
  });

  const approvedCount = cloudServices.filter((service: any) => service.approved).length;
  const ownerCount = cloudServices.filter((service: any) => typeof service.owner === "string" && service.owner.trim().length > 0).length;
  const linkedVendorCount = vendors.filter((vendor: any) => (vendor.relatedCloudServiceIds?.length ?? 0) > 0).length;

  return (
    <ModulePage
      title="Cloud Inventory"
      description="Maintain the cloud-service inventory created by the questionnaire so ownership, approval, data context, and linked vendor reviews stay current over time."
      icon={Server}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Tracked Services",
              value: `${cloudServices.length}`,
              detail: "Every cloud platform, hosted service, or business SaaS tool should appear here.",
              tone: "purple",
            },
            {
              label: "Approved",
              value: `${approvedCount}`,
              detail: `${percent(approvedCount, cloudServices.length || 1)}% of tracked services are marked approved for use.`,
              tone: approvedCount === cloudServices.length && cloudServices.length > 0 ? "green" : "orange",
            },
            {
              label: "Named Owners",
              value: `${ownerCount}`,
              detail: "Ownership is what turns inventory into an accountable operating record.",
              tone: ownerCount === cloudServices.length && cloudServices.length > 0 ? "green" : "orange",
            },
            {
              label: "Vendor Links",
              value: `${linkedVendorCount}`,
              detail: "Vendor reviews linked here help the dashboard measure cloud and supplier readiness together.",
              tone: linkedVendorCount > 0 ? "green" : "orange",
            },
          ]}
        />
      }
      formTitle="Add cloud service"
      formDescription="Use this register after the initial questionnaire whenever a new provider, SaaS app, backup platform, or hosted business service enters the organization."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await create(form);
            setForm({
              serviceName: "",
              providerName: "",
              serviceModel: "SaaS",
              purpose: "",
              dataStored: "",
              owner: "",
              approved: false,
            });
          }}
        >
          <Field label="Service name" hint="Examples: Google Workspace, Microsoft 365, Google Drive, website hosting, cloud backup.">
            <TextInput value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} />
          </Field>
          <Field label="Provider name">
            <TextInput value={form.providerName} onChange={(event) => setForm({ ...form, providerName: event.target.value })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Service model">
              <select className={fieldClass} value={form.serviceModel} onChange={(event) => setForm({ ...form, serviceModel: event.target.value })}>
                {["SaaS", "PaaS", "IaaS", "Messaging SaaS", "Hosting", "Backup", "Cloud service"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Internal owner">
              <TextInput value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
            </Field>
          </div>
          <Field label="Business purpose">
            <textarea className={fieldClass} rows={3} value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} />
          </Field>
          <Field label="Data stored or processed">
            <textarea className={fieldClass} rows={3} value={form.dataStored} onChange={(event) => setForm({ ...form, dataStored: event.target.value })} />
          </Field>
          <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm">
            <input checked={form.approved} type="checkbox" onChange={(event) => setForm({ ...form, approved: event.target.checked })} />
            <span>
              <span className="font-medium">Approved for use</span>
              <span className="mt-1 block text-xs text-muted-foreground">Mark this once the organization has accepted the provider and understands the business, vendor, and data implications.</span>
            </span>
          </label>
          <Button type="submit">Save cloud service</Button>
        </form>
      }
    >
      <SectionCard
        title="Inventory workflow"
        description="This is the guided step that sits between the initial questionnaire and detailed risk treatment."
      >
        <LinkedRecordStack
          items={[
            {
              title: "1. Confirm what cloud services exist",
              detail: "Record the real platforms the organization depends on instead of relying on informal memory.",
            },
            {
              title: "2. Assign ownership and approval",
              detail: "Every important service should have an internal owner and a clear approved or review-needed state.",
            },
            {
              title: "3. Link vendor review and risk follow-up",
              detail: "Once the service is registered, move into vendor evaluation, AI inventory, and risk treatment with the right context.",
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Tracked services" description="This register should stay current as the organization adopts new tools, changes owners, or updates approvals.">
        {cloudServices.length === 0 ? (
          <EmptyState
            title="No cloud services tracked yet"
            message="The initial questionnaire can create this inventory automatically. If you skipped that step or a new service was added later, register it here before moving deeper into vendor review or risk treatment."
            action={
              <Link className={buttonVariants({ variant: "outline" })} href="/onboarding">
                Start Readiness Assessment
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {cloudServices.map((service: any) => {
              const relatedVendors = vendors.filter((vendor: any) => (vendor.relatedCloudServiceIds ?? []).includes(service._id));
              const relatedRisks = risks.filter((risk: any) => risk.relatedCloudServiceId === service._id);
              const completeness = serviceCompleteness(service);

              return (
                <div className="rounded-[1.6rem] border border-border/70 bg-background p-5" key={service._id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">{service.serviceName}</h3>
                        <StatusBadge tone={service.approved ? "green" : "orange"}>
                          {service.approved ? "Approved" : "Needs review"}
                        </StatusBadge>
                        <StatusBadge tone={completeness >= 80 ? "green" : completeness >= 50 ? "orange" : "red"}>
                          {completeness}% complete
                        </StatusBadge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {service.purpose || "No business purpose has been captured yet."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => void update({ id: service._id, approved: !service.approved })}
                      >
                        {service.approved ? "Mark for review" : "Mark approved"}
                      </Button>
                      <Link className={buttonVariants({ size: "sm", variant: "outline" })} href="/vendors">
                        Review vendor context
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressLine value={completeness} tone={completeness >= 80 ? "green" : completeness >= 50 ? "orange" : "red"} />
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <InfoCell label="Provider" value={service.providerName} />
                    <InfoCell label="Service model" value={service.serviceModel} />
                    <InfoCell label="Owner" value={service.owner || "Unassigned"} />
                    <InfoCell label="Data context" value={service.dataStored || "No data summary yet"} />
                  </div>

                  <div className="mt-4 grid gap-3 xl:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Linked vendor reviews</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {relatedVendors.length > 0
                          ? relatedVendors.map((vendor: any) => vendor.vendorName).join(", ")
                          : "No vendor record is linked yet. Review the provider in the vendor workspace next."}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Related risks</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {relatedRisks.length > 0
                          ? relatedRisks.slice(0, 3).map((risk: any) => risk.title).join(", ")
                          : "No cloud-linked risks are connected yet. Add or review risk records after the inventory is clean."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
