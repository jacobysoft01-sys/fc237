"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { useMutation } from "convex/react";
import { Building2 } from "lucide-react";
import { useState } from "react";

import { Field, ModulePage, Select, SummaryGrid, TextInput, fieldClass } from "@/components/platform/modules/shared";

const frameworkOptions = ["FC237", "ISO/IEC 27001", "NIST AI RMF", "EU AI Act"];

export function OnboardingPage() {
  const createOrg = useMutation(api.organizations.create);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "Digital Solutions SARL",
    sector: "Technology services",
    location: "Douala, Cameroon",
    employeeCount: 24,
    ictSupportStatus: "Internal ICT focal point",
    cloudUsageStatus: "Uses cloud services daily",
    riskOwner: "David",
    cyberFocalPoint: "David",
    companyProfile: "Regional digital services SME with customer support, operations, and finance workflows in cloud tools.",
    website: "https://digital-solutions.example",
    contacts: {
      primaryName: "David",
      primaryEmail: "david@example.com",
      primaryPhone: "+237 600 000 000",
      complianceLead: "David",
      complianceEmail: "compliance@example.com",
      technicalLead: "ICT Support",
      technicalEmail: "ict@example.com",
    },
    selectedFrameworks: ["FC237", "ISO/IEC 27001", "NIST AI RMF"],
    preferences: {
      reportingFrequency: "monthly",
      reminderCadence: "weekly",
      notificationEmail: true,
      notificationDashboard: true,
      weeklyDigest: true,
      languagePreference: "English",
    },
    branding: {
      shortName: "Digital Solutions",
      primaryColor: "#0f766e",
      accentColor: "#f59e0b",
      logoUrl: "",
    },
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await createOrg(form);
      window.location.href = "/dashboard";
    } finally {
      setPending(false);
    }
  }

  function toggleFramework(framework: string) {
    setForm((current) => ({
      ...current,
      selectedFrameworks: current.selectedFrameworks.includes(framework)
        ? current.selectedFrameworks.filter((item) => item !== framework)
        : [...current.selectedFrameworks, framework],
    }));
  }

  return (
    <ModulePage
      title="Organization Setup"
      description="Phase 1 starts with a real organization profile, contact map, compliance preferences, and brand settings so the seeded demo workflow reflects how the team actually operates."
      icon={Building2}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Seeded Baseline",
              value: "Linked",
              detail: "Controls, risks, assessments, vendors, evidence, incidents, and actions are seeded together.",
              tone: "purple",
            },
            {
              label: "Frameworks",
              value: `${form.selectedFrameworks.length}`,
              detail: "Selected frameworks shape readiness reporting and dashboard language.",
            },
            {
              label: "Cadence",
              value: form.preferences.reportingFrequency,
              detail: "Used for reporting and reminder defaults.",
              tone: "green",
            },
            {
              label: "Language",
              value: form.preferences.languagePreference,
              detail: "Stored for future localization and policy templates.",
            },
          ]}
        />
      }
      formTitle="Build the command center"
      formDescription="Create the organization record once, then let the system seed the full Phase 1 workflow on top of it."
      form={
        <form className="grid gap-5" onSubmit={submit}>
          <Card className="rounded-2xl border border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Company profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Organization name">
                <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </Field>
              <Field label="Sector">
                <TextInput value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })} />
              </Field>
              <Field label="Location">
                <TextInput value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
              </Field>
              <Field label="Employees">
                <TextInput
                  type="number"
                  value={form.employeeCount}
                  onChange={(event) => setForm({ ...form, employeeCount: Number(event.target.value) })}
                />
              </Field>
              <Field label="ICT support status">
                <TextInput
                  value={form.ictSupportStatus}
                  onChange={(event) => setForm({ ...form, ictSupportStatus: event.target.value })}
                />
              </Field>
              <Field label="Cloud usage status">
                <TextInput
                  value={form.cloudUsageStatus}
                  onChange={(event) => setForm({ ...form, cloudUsageStatus: event.target.value })}
                />
              </Field>
              <Field label="Risk owner">
                <TextInput value={form.riskOwner} onChange={(event) => setForm({ ...form, riskOwner: event.target.value })} />
              </Field>
              <Field label="Cyber focal point">
                <TextInput
                  value={form.cyberFocalPoint}
                  onChange={(event) => setForm({ ...form, cyberFocalPoint: event.target.value })}
                />
              </Field>
              <Field label="Website" hint="Optional but useful for report branding.">
                <TextInput value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
              </Field>
              <Field label="Profile summary">
                <textarea
                  className={fieldClass}
                  rows={4}
                  value={form.companyProfile}
                  onChange={(event) => setForm({ ...form, companyProfile: event.target.value })}
                />
              </Field>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Contacts and preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Primary contact">
                <TextInput
                  value={form.contacts.primaryName}
                  onChange={(event) => setForm({ ...form, contacts: { ...form.contacts, primaryName: event.target.value } })}
                />
              </Field>
              <Field label="Primary email">
                <TextInput
                  value={form.contacts.primaryEmail}
                  onChange={(event) => setForm({ ...form, contacts: { ...form.contacts, primaryEmail: event.target.value } })}
                />
              </Field>
              <Field label="Compliance lead">
                <TextInput
                  value={form.contacts.complianceLead}
                  onChange={(event) =>
                    setForm({ ...form, contacts: { ...form.contacts, complianceLead: event.target.value } })
                  }
                />
              </Field>
              <Field label="Technical lead">
                <TextInput
                  value={form.contacts.technicalLead}
                  onChange={(event) =>
                    setForm({ ...form, contacts: { ...form.contacts, technicalLead: event.target.value } })
                  }
                />
              </Field>
              <Field label="Reporting frequency">
                <Select
                  options={["weekly", "monthly", "quarterly"]}
                  value={form.preferences.reportingFrequency}
                  onChange={(value) => setForm({ ...form, preferences: { ...form.preferences, reportingFrequency: value } })}
                />
              </Field>
              <Field label="Reminder cadence">
                <Select
                  options={["daily", "weekly", "biweekly", "monthly"]}
                  value={form.preferences.reminderCadence}
                  onChange={(value) => setForm({ ...form, preferences: { ...form.preferences, reminderCadence: value } })}
                />
              </Field>
              <Field label="Language preference">
                <Select
                  options={["English", "French"]}
                  value={form.preferences.languagePreference}
                  onChange={(value) => setForm({ ...form, preferences: { ...form.preferences, languagePreference: value } })}
                />
              </Field>
              <Field label="Brand short name">
                <TextInput
                  value={form.branding.shortName}
                  onChange={(event) => setForm({ ...form, branding: { ...form.branding, shortName: event.target.value } })}
                />
              </Field>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Framework scope</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                {frameworkOptions.map((framework) => (
                  <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm" key={framework}>
                    <input
                      checked={form.selectedFrameworks.includes(framework)}
                      onChange={() => toggleFramework(framework)}
                      type="checkbox"
                    />
                    <span>{framework}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button disabled={pending} type="submit">
                  {pending ? "Seeding workspace..." : "Create organization and seed Phase 1 workspace"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      }
    >
      <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-border">
        <CardHeader>
          <CardTitle>What gets created</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>The initial workspace seeds linked controls, AI systems, vendor reviews, risks, evidence, policies, a baseline readiness assessment, and an action plan.</p>
          <p>The goal is to land users inside a working command center rather than empty CRUD tables, so the next action is always obvious from the first login.</p>
        </CardContent>
      </Card>
    </ModulePage>
  );
}
