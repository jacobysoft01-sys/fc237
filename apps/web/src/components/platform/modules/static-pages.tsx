"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { Library, Settings, Shield, Users } from "lucide-react";
import { useState } from "react";

import { EmptyState, Field, LinkedRecordStack, ModulePage, SectionCard, SummaryGrid, TextInput, fieldClass } from "@/components/platform/modules/shared";

export function FrameworkPage() {
  const dashboard = useQuery(api.dashboard.getOverview);
  const overview = dashboard && !dashboard.needsOnboarding ? dashboard : null;

  return (
    <ModulePage
      title="Framework Guide"
      description="The FC237 guide now frames the web app as a command center. Use this page as the orientation layer that explains why the sections are grouped the way they are."
      icon={Shield}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Command Center",
              value: "3",
              detail: "Dashboard, Assistant, and Action Plan keep the operating loop visible.",
              tone: "purple",
            },
            {
              label: "Core Workflow",
              value: "7",
              detail: "Seven domain scores roll into the equal-weight FC237 overall score.",
              tone: "green",
            },
            {
              label: "Primary Report",
              value: "1",
              detail: "Compliance Readiness Summary is the first-class export in Phase 1.",
              tone: "orange",
            },
            {
              label: "Current Status",
              value: overview?.score.status ?? "Waiting",
              detail: overview?.assistantInsight.summary ?? "Complete onboarding to populate the guide-backed workflow.",
              tone: "green",
            },
          ]}
        />
      }
      form={null}
    >
      <SectionCard title="Guide Sections" description="The app is grouped around guided execution, not isolated data entry.">
        <LinkedRecordStack
          items={[
            {
              title: "Command Center",
              detail: "See the overall score, domain scores, recommended next actions, risk rollup, evidence rollup, and assistant insight.",
            },
            {
              title: "Assessments",
              detail: "Use readiness and maturity to refresh scores and surface the next control, policy, vendor, or incident priority.",
            },
            {
              title: "Governance",
              detail: "Track AI systems, risks, controls, and policies with shared ownership and linked evidence expectations.",
            },
            {
              title: "Assurance",
              detail: "Use vendor reviews, evidence, incidents, and reports to prove the operating model is real.",
            },
          ]}
        />
      </SectionCard>
    </ModulePage>
  );
}

export function ResourcesPage() {
  return (
    <ModulePage
      title="Resources"
      description="Use this space for practical guidance, starter prompts, and cross-links that help users understand what to do next when a module is empty."
      icon={Library}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Guidance Style",
              value: "Contextual",
              detail: "Resources in Phase 1 are meant to support action, not replace the workflow pages.",
              tone: "purple",
            },
            {
              label: "Assistant Modes",
              value: "7",
              detail: "Ask, Assessment, Recommendation, Evidence, Incident, Report, and Policy.",
              tone: "green",
            },
            {
              label: "Templates",
              value: "Policy",
              detail: "Policy help is template-oriented rather than free-form generation.",
              tone: "orange",
            },
            {
              label: "Next Step",
              value: "Action Plan",
              detail: "When unsure where to begin, use the action plan queue and assistant together.",
              tone: "green",
            },
          ]}
        />
      }
    >
      <SectionCard title="Suggested Work Sequence" description="A lightweight guide for new users entering the platform for the first time.">
        <ol className="grid gap-3 text-sm text-muted-foreground">
          <li>1. Complete onboarding and confirm your organization profile.</li>
          <li>2. Run the readiness assessment to populate scores and follow-up actions.</li>
          <li>3. Register AI systems and vendor evaluations that touch customer or business-critical data.</li>
          <li>4. Link controls to evidence and confirm policy and incident readiness.</li>
          <li>5. Work the action plan, then generate the compliance summary report.</li>
        </ol>
      </SectionCard>
    </ModulePage>
  );
}

export function SettingsPage() {
  const current = useQuery(api.organizations.getCurrent);
  const update = useMutation(api.organizations.update);
  const [status, setStatus] = useState("");

  const organization = current?.organization;

  return (
    <ModulePage
      title="Settings"
      description="Phase 1 settings focus on organization profile, reporting cadence, and branding so the dashboard and report outputs stay aligned to the SME context."
      icon={Settings}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Reporting",
              value: organization?.preferences?.reportingFrequency ?? "Not set",
              detail: "Used by the command center and report cadence defaults.",
              tone: "purple",
            },
            {
              label: "Reminder Cadence",
              value: organization?.preferences?.reminderCadence ?? "Not set",
              detail: "Useful for later notification and recurring review flows.",
              tone: "green",
            },
            {
              label: "Frameworks",
              value: `${organization?.selectedFrameworks?.length ?? 0}`,
              detail: "Selected frameworks retained at the organization level.",
              tone: "orange",
            },
            {
              label: "Save State",
              value: status || "Idle",
              detail: "Update settings here without touching workflow records.",
              tone: "green",
            },
          ]}
        />
      }
    >
      {!organization ? (
        <SectionCard title="Organization settings">
          <EmptyState title="Organization required" message="Complete onboarding first so the settings page has a real organization profile to edit." />
        </SectionCard>
      ) : (
        <SectionCard title="Organization profile" description="Keep the reporting and branding layer current without disrupting seeded demo flows.">
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              await update({
                name: String(formData.get("name") ?? organization.name),
                companyProfile: String(formData.get("companyProfile") ?? organization.companyProfile ?? ""),
                website: String(formData.get("website") ?? organization.website ?? ""),
                preferences: {
                  ...organization.preferences,
                  reportingFrequency: String(formData.get("reportingFrequency") ?? organization.preferences?.reportingFrequency ?? "monthly"),
                  reminderCadence: String(formData.get("reminderCadence") ?? organization.preferences?.reminderCadence ?? "weekly"),
                  languagePreference: String(formData.get("languagePreference") ?? organization.preferences?.languagePreference ?? "English"),
                  notificationEmail: Boolean(formData.get("notificationEmail") ?? organization.preferences?.notificationEmail ?? true),
                  notificationDashboard: Boolean(formData.get("notificationDashboard") ?? organization.preferences?.notificationDashboard ?? true),
                  weeklyDigest: Boolean(formData.get("weeklyDigest") ?? organization.preferences?.weeklyDigest ?? true),
                },
                branding: {
                  ...organization.branding,
                  shortName: String(formData.get("shortName") ?? organization.branding?.shortName ?? organization.name),
                  primaryColor: String(formData.get("primaryColor") ?? organization.branding?.primaryColor ?? "#0f766e"),
                  accentColor: String(formData.get("accentColor") ?? organization.branding?.accentColor ?? "#f59e0b"),
                },
              });
              setStatus("Saved");
            }}
          >
            <Field label="Organization name">
              <TextInput defaultValue={organization.name} name="name" />
            </Field>
            <Field label="Website">
              <TextInput defaultValue={organization.website ?? ""} name="website" />
            </Field>
            <Field label="Reporting frequency">
              <TextInput defaultValue={organization.preferences?.reportingFrequency ?? "monthly"} name="reportingFrequency" />
            </Field>
            <Field label="Reminder cadence">
              <TextInput defaultValue={organization.preferences?.reminderCadence ?? "weekly"} name="reminderCadence" />
            </Field>
            <Field label="Language">
              <TextInput defaultValue={organization.preferences?.languagePreference ?? "English"} name="languagePreference" />
            </Field>
            <Field label="Short name">
              <TextInput defaultValue={organization.branding?.shortName ?? organization.name} name="shortName" />
            </Field>
            <Field label="Primary color">
              <TextInput defaultValue={organization.branding?.primaryColor ?? "#0f766e"} name="primaryColor" />
            </Field>
            <Field label="Accent color">
              <TextInput defaultValue={organization.branding?.accentColor ?? "#f59e0b"} name="accentColor" />
            </Field>
            <Field label="Company profile">
              <textarea className={fieldClass} defaultValue={organization.companyProfile ?? ""} name="companyProfile" rows={4} />
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Save settings</Button>
            </div>
          </form>
        </SectionCard>
      )}
    </ModulePage>
  );
}

export function AdminPage() {
  const dashboard = useQuery(api.dashboard.getOverview);
  const overview = dashboard && !dashboard.needsOnboarding ? dashboard : null;

  return (
    <ModulePage
      title="Administration"
      description="Phase 1 admin keeps the system explainable: who owns the workspace, how scores are composed, and where the next decisions should go."
      icon={Users}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Membership",
              value: overview?.membership?.role ?? "Pending",
              detail: "Current membership role for the signed-in user.",
              tone: "purple",
            },
            {
              label: "Recent Activity",
              value: `${overview?.recentActivity?.length ?? 0}`,
              detail: "Recent audit log items available on the dashboard.",
              tone: "green",
            },
            {
              label: "Reports",
              value: `${overview?.reports?.length ?? 0}`,
              detail: "Generated reports retained in the organization history.",
              tone: "orange",
            },
            {
              label: "Knowledge Style",
              value: "Deterministic",
              detail: "The platform relies on structured records and templates rather than opaque generated reasoning.",
              tone: "green",
            },
          ]}
        />
      }
    >
      <SectionCard title="Admin notes" description="Keep the platform understandable for operators, reviewers, and future automation.">
        <LinkedRecordStack
          items={[
            {
              title: "Dashboard is data-backed",
              detail: "No artificial floors are used for the seven domain scores or the overall FC237 score.",
            },
            {
              title: "Action generation is idempotent",
              detail: "Generated tasks update by stable keys to reduce duplicate task spam.",
            },
            {
              title: "Policy help is template-based",
              detail: "Phase 1 avoids making a live external model a dependency for core governance workflows.",
            },
          ]}
        />
      </SectionCard>
    </ModulePage>
  );
}
