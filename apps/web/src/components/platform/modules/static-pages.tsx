"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { useMutation, useQuery } from "convex/react";
import { ArrowUpRight, BellRing, Download, Library, Settings, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  cloudUsageOptions,
  downloadTemplates,
  frameworkOptions,
  ictSupportOptions,
  languagePreferenceOptions,
  platformSections,
  reminderCadenceOptions,
  reportingFrequencyOptions,
  resourcePlaybooks,
} from "@/components/platform/modules/guide-data";
import {
  EmptyState,
  Field,
  LinkedRecordStack,
  ModulePage,
  SectionCard,
  SummaryGrid,
  fieldClass,
  scoreTone,
  statusTone,
} from "@/components/platform/modules/shared";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";

function formatValue(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function formatOptionalValue(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function formatNumber(value: FormDataEntryValue | null, fallback?: number) {
  if (typeof value !== "string" || value.trim().length === 0) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function hasChecked(formData: FormData, key: string) {
  return formData.has(key);
}

function questionTone(score: number) {
  if (score >= 4) return "green";
  if (score >= 2.5) return "orange";
  if (score > 0) return "red";
  return "neutral";
}

function questionLabel(score: number) {
  if (score >= 4) return "Strong";
  if (score >= 3) return "Moderate";
  if (score > 0) return "Weak";
  return "Unanswered";
}

function organizationProfileCompletion(organization: any) {
  if (!organization) return 0;
  const checks = [
    organization.name,
    organization.sector,
    organization.location,
    organization.website,
    organization.companyProfile,
    organization.riskOwner,
    organization.cyberFocalPoint,
    organization.contacts?.primaryEmail,
    organization.contacts?.complianceEmail,
    organization.contacts?.technicalEmail,
    organization.branding?.shortName,
    organization.branding?.reportHeader,
    organization.preferences?.reportingFrequency,
    organization.preferences?.reminderCadence,
    organization.preferences?.languagePreference,
    organization.selectedFrameworks?.length ? "frameworks-selected" : "",
  ];
  const completed = checks.filter((value) => typeof value === "string" && value.trim().length > 0).length;
  return Math.round((completed / checks.length) * 100);
}

function downloadTemplate(fileName: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function FrameworkPage() {
  const dashboard = useQuery(api.dashboard.getOverview);
  const actionPlan = useQuery(api.tasks.getActionPlan, {});
  const controls = useQuery(api.controls.list) ?? [];
  const evidence = useQuery(api.evidence.list) ?? [];
  const vendors = useQuery(api.vendors.list) ?? [];
  const policies = useQuery(api.policies.list) ?? [];
  const aiSystems = useQuery(api.aiSystems.list) ?? [];
  const incidents = useQuery(api.incidents.list) ?? [];

  const overview = dashboard && !dashboard.needsOnboarding ? dashboard : null;

  const selectedFrameworks = overview?.organization.selectedFrameworks ?? [];
  const profileCompletion = organizationProfileCompletion(overview?.organization);
  const requiredEvidenceSlots = overview?.evidenceRollup.requiredSlots ?? 0;
  const acceptedEvidenceSlots = overview?.evidenceRollup.acceptedSlots ?? 0;
  const readinessAnswered = overview?.readiness.questions.filter((question: any) => question.score > 0).length ?? 0;
  const activeActions = actionPlan?.summary.active ?? overview?.nextActions.length ?? 0;
  const commandProgress = overview?.score.overall ?? 0;

  const pillarCards = overview
    ? platformSections.map((section) => {
        switch (section.key) {
          case "command_center":
            return {
              ...section,
              metric: `${overview.score.overall}%`,
              progress: commandProgress,
              status: overview.score.status,
              tone: scoreTone(overview.score.status),
              detail: `${activeActions} active actions and ${overview.topRisks.length} urgent risks are already surfaced for the team.`,
              highlights: [
                `${overview.domainScores.length} domain scores contribute to the overall FC237 score.`,
                `Assistant mode is currently ${overview.assistantInsight.mode}.`,
              ],
            };
          case "assessments":
            return {
              ...section,
              metric: `${overview.readiness.latestAssessmentScore}%`,
              progress: overview.readiness.latestAssessmentScore,
              status: readinessAnswered === overview.readiness.questions.length ? "Current" : "Partial",
              tone: readinessAnswered === overview.readiness.questions.length ? "green" : readinessAnswered > 0 ? "orange" : "red",
              detail: `${readinessAnswered}/${overview.readiness.questions.length} readiness questions have stored scores and maturity is ${overview.maturitySupport.label}.`,
              highlights: [
                `${overview.maturitySupport.domains.length} maturity domains are available for follow-up discussion.`,
                `${overview.reportPreviews[0]?.summary ?? "Run readiness to refresh the primary report."}`,
              ],
            };
          case "governance":
            return {
              ...section,
              metric: `${aiSystems.length + controls.length}`,
              progress: Math.round(
                ((overview.domainScores.find((domain: any) => domain.key === "ai_governance")?.score ?? 0) +
                  (overview.domainScores.find((domain: any) => domain.key === "risk_management")?.score ?? 0) +
                  (overview.domainScores.find((domain: any) => domain.key === "policy_maturity")?.score ?? 0)) /
                  3,
              ),
              status: `${overview.riskRollup.highOrCritical} elevated risks`,
              tone: overview.riskRollup.highOrCritical > 0 ? "orange" : "green",
              detail: `${aiSystems.length} AI systems, ${controls.length} controls, and ${policies.length} policy records are sharing one execution model.`,
              highlights: [
                `${overview.riskRollup.withoutControls} risks still need control links.`,
                `${overview.aiRollup.pendingApproval} AI systems are still waiting on approval coverage.`,
              ],
            };
          case "assurance":
            return {
              ...section,
              metric: `${acceptedEvidenceSlots}/${requiredEvidenceSlots || 0}`,
              progress: overview.domainScores.find((domain: any) => domain.key === "evidence_coverage")?.score ?? 0,
              status: `${overview.vendorRollup.weak} weak vendors`,
              tone: overview.vendorRollup.weak > 0 || overview.incidentRollup.unresolved > 0 ? "orange" : "green",
              detail: `${vendors.length} vendor evaluations, ${evidence.length} evidence records, and ${incidents.length} incidents feed the proof layer.`,
              highlights: [
                `${overview.vendorRollup.outstandingGaps} vendor reviews still have documentation gaps.`,
                `${overview.incidentRollup.unresolved} incidents are unresolved right now.`,
              ],
            };
          case "knowledge_base":
            return {
              ...section,
              metric: `${resourcePlaybooks.length + downloadTemplates.length}`,
              progress: Math.round(
                ((overview.reportPreviews.length / 3) * 50) +
                  ((selectedFrameworks.length / frameworkOptions.length) * 25) +
                  ((policies.length > 0 ? 1 : 0) * 25),
              ),
              status: `${selectedFrameworks.length} frameworks`,
              tone: selectedFrameworks.length > 0 ? "green" : "orange",
              detail: `${resourcePlaybooks.length} guided playbooks and ${downloadTemplates.length} reusable starter packs are ready for the team.`,
              highlights: [
                `${overview.reportPreviews.length} report preview families are already wired to live data.`,
                `${overview.policyRollup.missingPriorityPolicies} priority policy types still need coverage.`,
              ],
            };
          case "administration":
            return {
              ...section,
              metric: `${profileCompletion}%`,
              progress: profileCompletion,
              status: overview.membership?.role ?? "Pending",
              tone: profileCompletion >= 75 ? "green" : profileCompletion >= 45 ? "orange" : "red",
              detail: `Profile completion is based on core organization, contact, cadence, and branding fields used across the workspace.`,
              highlights: [
                `${overview.recentActivity.length} recent audit events are visible from the dashboard.`,
                `${selectedFrameworks.join(", ") || "No frameworks selected yet."}`,
              ],
            };
          default:
            return null;
        }
      }).filter(Boolean)
    : [];

  return (
    <ModulePage
      title="Framework Guide"
      description="This page turns the FC237 guide into an orientation layer for the web app, so each section explains what it owns, which records it relies on, and what success looks like."
      icon={Shield}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Selected Frameworks",
              value: `${selectedFrameworks.length}`,
              detail: selectedFrameworks.length > 0 ? selectedFrameworks.join(", ") : "Choose frameworks in settings to align guidance and report language.",
              tone: selectedFrameworks.length > 0 ? "green" : "orange",
            },
            {
              label: "Guide Sections",
              value: `${platformSections.length}`,
              detail: "Command Center, Assessments, Governance, Assurance, Knowledge Base, and Administration.",
              tone: "purple",
            },
            {
              label: "Active Actions",
              value: `${activeActions}`,
              detail: "The framework is now tied directly to the action queue instead of static documentation alone.",
              tone: activeActions > 0 ? "orange" : "green",
            },
            {
              label: "Current Status",
              value: overview?.score.status ?? "Waiting",
              detail: overview?.assistantInsight.summary ?? "Complete onboarding to populate the guide with real command-center signals.",
              tone: scoreTone(overview?.score.status ?? "neutral"),
            },
          ]}
        />
      }
    >
      {!overview ? (
        <SectionCard title="Guide unavailable">
          <EmptyState
            title="Complete onboarding first"
            message="The framework guide becomes useful once the organization, readiness, controls, risks, and evidence records exist. Onboarding seeds that baseline workspace."
            action={
              <Link href="/onboarding">
                <Button>Open onboarding</Button>
              </Link>
            }
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard title="Operating Model Map" description="Each section below is grounded in live FC237 records, not placeholder guide text.">
            <div className="grid gap-4 xl:grid-cols-2">
              {pillarCards.map((card: any) => (
                <Card className="rounded-2xl border border-border/70 shadow-none" key={card.key}>
                  <CardHeader className="gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <CardDescription className="mt-2">{card.description}</CardDescription>
                      </div>
                      <StatusBadge tone={card.tone}>{card.status}</StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div>
                      <div className="text-3xl font-semibold tracking-tight">{card.metric}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        <span>Coverage</span>
                        <span>{card.progress}%</span>
                      </div>
                      <ProgressLine value={card.progress} tone={card.progress >= 70 ? "green" : card.progress >= 45 ? "orange" : "red"} />
                    </div>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      {card.highlights.map((highlight: string) => (
                        <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2" key={highlight}>
                          {highlight}
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {card.routes.map((route: any) => (
                        <Link
                          className="flex items-center justify-between rounded-xl border border-border/70 bg-background px-3 py-2 text-sm font-medium transition hover:border-primary/35 hover:bg-muted/25"
                          href={route.href}
                          key={`${card.key}-${route.href}`}
                        >
                          <span>{route.label}</span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                    <div className="rounded-xl border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">{card.successSignal}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Readiness Question Bank" description="These seven questions now drive stored assessment responses, domain scoring, and the generated action queue.">
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {overview.readiness.questions.map((question: any) => (
                <div className="rounded-2xl border border-border/70 bg-background p-4" key={question.key}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{question.domain}</div>
                      <div className="mt-2 text-base font-semibold">{question.label}</div>
                    </div>
                    <StatusBadge tone={questionTone(question.score)}>{questionLabel(question.score)}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{question.prompt}</p>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Stored score</span>
                      <span>{question.score}/5</span>
                    </div>
                    <ProgressLine value={question.score * 20} tone={question.score >= 4 ? "green" : question.score >= 2.5 ? "orange" : "red"} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Guide-Driven Next Steps" description="These links make the guide actionable when someone needs a clear path out of a weak score or empty state.">
            <LinkedRecordStack
              items={[
                {
                  title: "Review the dashboard with the guide context in mind",
                  detail: `${overview.score.overall}% overall score, ${overview.riskRollup.highOrCritical} urgent risks, and ${activeActions} active actions are already visible.`,
                  href: "/dashboard",
                },
                {
                  title: "Open the action queue for execution",
                  detail: actionPlan?.summary.critical
                    ? `${actionPlan.summary.critical} critical items need action before the next reporting cycle.`
                    : "The action queue is the best place to convert weak readiness or evidence gaps into work.",
                  href: "/action-plan",
                },
                {
                  title: "Use reports when the workspace data looks clean",
                  detail: overview.reportPreviews[0]?.summary ?? "Store the compliance summary after validating scores, risks, and evidence coverage.",
                  href: "/reports",
                },
              ]}
            />
          </SectionCard>
        </>
      )}
    </ModulePage>
  );
}

export function ResourcesPage() {
  const dashboard = useQuery(api.dashboard.getOverview);
  const actionPlan = useQuery(api.tasks.getActionPlan, {});

  const overview = dashboard && !dashboard.needsOnboarding ? dashboard : null;
  const recommendations: Array<{ title: string; detail: string; href: "/readiness" | "/evidence" | "/vendors" | "/policies" | "/assistant" | "/reports" }> = [];

  if (overview) {
    if (overview.readiness.latestAssessmentScore === 0) {
      recommendations.push({
        title: "Start with the readiness assessment",
        detail: "No stored readiness score exists yet, so the question bank is still the fastest way to unlock domain scoring and action generation.",
        href: "/readiness",
      });
    }

    if (overview.evidenceRollup.requiredSlots > overview.evidenceRollup.acceptedSlots) {
      recommendations.push({
        title: "Close missing evidence coverage",
        detail: `${overview.evidenceRollup.requiredSlots - overview.evidenceRollup.acceptedSlots} required evidence slots still lack accepted proof.`,
        href: "/evidence",
      });
    }

    if (overview.vendorRollup.weak > 0 || overview.vendorRollup.outstandingGaps > 0) {
      recommendations.push({
        title: "Triage vendor assurance",
        detail: `${overview.vendorRollup.weak} vendor reviews are weak and ${overview.vendorRollup.outstandingGaps} still have documentation gaps.`,
        href: "/vendors",
      });
    }

    if (overview.policyRollup.draftOrExpired > 0 || overview.policyRollup.missingPriorityPolicies > 0) {
      recommendations.push({
        title: "Advance policy work",
        detail: `${overview.policyRollup.draftOrExpired} policies are draft or expired and ${overview.policyRollup.missingPriorityPolicies} priority policy types are still missing.`,
        href: "/policies",
      });
    }
  }

  return (
    <ModulePage
      title="Resources"
      description="This library supports the guided workflow with playbooks, reusable starter packs, and context-aware prompts that point people back into the live workspace."
      icon={Library}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Guided Playbooks",
              value: `${resourcePlaybooks.length}`,
              detail: "Each playbook points into an existing route instead of creating a parallel documentation maze.",
              tone: "purple",
            },
            {
              label: "Starter Downloads",
              value: `${downloadTemplates.length}`,
              detail: "Reusable templates for action planning, evidence collection, vendor review, and policy approval.",
              tone: "green",
            },
            {
              label: "Assistant Mode",
              value: overview?.assistantInsight.mode ?? "Ask",
              detail: overview?.assistantInsight.title ?? "The assistant now uses OpenAI with workspace grounding and Cameroon-aware governance instructions.",
              tone: "orange",
            },
            {
              label: "Active Queue",
              value: `${actionPlan?.summary.active ?? 0}`,
              detail: overview?.assistantInsight.summary ?? "Use the action plan and the dashboard together when picking the next move.",
              tone: (actionPlan?.summary.active ?? 0) > 0 ? "orange" : "green",
            },
          ]}
        />
      }
    >
      <SectionCard title="Command Center Playbooks" description="Use these when the team needs a practical sequence instead of a blank module page.">
        <div className="grid gap-4 xl:grid-cols-2">
          {resourcePlaybooks.map((playbook) => (
            <Card className="rounded-2xl border border-border/70 shadow-none" key={playbook.key}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{playbook.category}</div>
                    <CardTitle className="mt-2 text-lg">{playbook.title}</CardTitle>
                    <CardDescription className="mt-2">{playbook.description}</CardDescription>
                  </div>
                  <StatusBadge tone="purple">Guide</StatusBadge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  {playbook.bulletPoints.map((point) => (
                    <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2" key={point}>
                      {point}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={playbook.href}>
                    <Button>{playbook.ctaLabel}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Starter Packs" description="These downloads give operators a clean working artifact without inventing new backend tables or side channels.">
        <div className="grid gap-4 lg:grid-cols-2">
          {downloadTemplates.map((template) => (
            <div className="rounded-2xl border border-border/70 bg-background p-5" key={template.key}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{template.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{template.description}</p>
                </div>
                <Button onClick={() => downloadTemplate(template.fileName, template.content, template.mimeType)} size="sm" variant="outline">
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">{template.fileName}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="What the data says to do next" description="These recommendations are generated from the same live workspace state used by the dashboard and assistant.">
        {overview ? (
          <LinkedRecordStack
            items={[
              ...recommendations,
              {
                title: "Ask the assistant for a focused next action",
                detail: `${overview.assistantInsight.title}. Suggested moves: ${overview.assistantInsight.recommendedActions.join(" ")}`,
                href: "/assistant",
              },
              {
                title: "Check the primary report preview",
                detail: overview.reportPreviews[0]?.summary ?? "Open reports once the team is ready to validate the compliance summary.",
                href: "/reports",
              },
            ]}
          />
        ) : (
          <EmptyState title="Resources become smarter after onboarding" message="Once the workspace has an organization and seeded records, this page will start pointing to the specific playbooks and starter packs that match the current gaps." />
        )}
      </SectionCard>
    </ModulePage>
  );
}

export function SettingsPage() {
  const current = useQuery(api.organizations.getCurrent);
  const update = useMutation(api.organizations.update);
  const [status, setStatus] = useState("Idle");

  const organization = current?.organization;
  const completion = organizationProfileCompletion(organization);

  return (
    <ModulePage
      title="Settings"
      description="Update the organization profile, framework scope, contacts, cadence, and branding that anchor dashboard language, report exports, and guided prompts."
      icon={Settings}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Profile Completion",
              value: `${completion}%`,
              detail: "Completion tracks the fields that most directly affect reports, ownership, and guidance quality.",
              tone: completion >= 75 ? "green" : completion >= 45 ? "orange" : "red",
            },
            {
              label: "Reporting Cadence",
              value: organization?.preferences?.reportingFrequency ?? "Not set",
              detail: "Used as the reporting rhythm for command-center review and exported summaries.",
              tone: "purple",
            },
            {
              label: "Framework Scope",
              value: `${organization?.selectedFrameworks?.length ?? 0}`,
              detail: organization?.selectedFrameworks?.join(", ") ?? "Choose the frameworks that should shape the workspace narrative.",
              tone: (organization?.selectedFrameworks?.length ?? 0) > 0 ? "green" : "orange",
            },
            {
              label: "Save State",
              value: status,
              detail: "Changes are additive and stay inside the existing organization record rather than forking new setup flows.",
              tone: status === "Saved" ? "green" : status === "Saving..." ? "orange" : "purple",
            },
          ]}
        />
      }
    >
      {!organization ? (
        <SectionCard title="Organization settings">
          <EmptyState
            title="Organization required"
            message="Complete onboarding first so the settings page has a real profile to edit and the guide-backed workflow has the right defaults."
            action={
              <Link href="/onboarding">
                <Button>Open onboarding</Button>
              </Link>
            }
          />
        </SectionCard>
      ) : (
        <form
          className="grid gap-6"
          onSubmit={async (event) => {
            event.preventDefault();
            setStatus("Saving...");
            const formData = new FormData(event.currentTarget);

            try {
              await update({
                name: formatValue(formData.get("name"), organization.name),
                sector: formatValue(formData.get("sector"), organization.sector),
                location: formatValue(formData.get("location"), organization.location),
                employeeCount: formatNumber(formData.get("employeeCount"), organization.employeeCount),
                ictSupportStatus: formatValue(formData.get("ictSupportStatus"), organization.ictSupportStatus),
                cloudUsageStatus: formatValue(formData.get("cloudUsageStatus"), organization.cloudUsageStatus),
                riskOwner: formatValue(formData.get("riskOwner"), organization.riskOwner),
                cyberFocalPoint: formatValue(formData.get("cyberFocalPoint"), organization.cyberFocalPoint),
                companyProfile: formatValue(formData.get("companyProfile"), organization.companyProfile ?? ""),
                website: formatValue(formData.get("website"), organization.website ?? ""),
                contacts: {
                  primaryName: formatOptionalValue(formData.get("primaryName")),
                  primaryEmail: formatOptionalValue(formData.get("primaryEmail")),
                  primaryPhone: formatOptionalValue(formData.get("primaryPhone")),
                  complianceLead: formatOptionalValue(formData.get("complianceLead")),
                  complianceEmail: formatOptionalValue(formData.get("complianceEmail")),
                  technicalLead: formatOptionalValue(formData.get("technicalLead")),
                  technicalEmail: formatOptionalValue(formData.get("technicalEmail")),
                },
                selectedFrameworks: formData.getAll("selectedFrameworks").map(String).filter(Boolean),
                preferences: {
                  ...organization.preferences,
                  reportingFrequency: formatValue(formData.get("reportingFrequency"), organization.preferences?.reportingFrequency ?? "monthly"),
                  reminderCadence: formatValue(formData.get("reminderCadence"), organization.preferences?.reminderCadence ?? "weekly"),
                  languagePreference: formatValue(formData.get("languagePreference"), organization.preferences?.languagePreference ?? "English"),
                  notificationEmail: hasChecked(formData, "notificationEmail"),
                  notificationDashboard: hasChecked(formData, "notificationDashboard"),
                  weeklyDigest: hasChecked(formData, "weeklyDigest"),
                },
                branding: {
                  ...organization.branding,
                  shortName: formatValue(formData.get("shortName"), organization.branding?.shortName ?? organization.name),
                  primaryColor: formatValue(formData.get("primaryColor"), organization.branding?.primaryColor ?? "#0f766e"),
                  accentColor: formatValue(formData.get("accentColor"), organization.branding?.accentColor ?? "#f59e0b"),
                  logoUrl: formatOptionalValue(formData.get("logoUrl")),
                  reportHeader: formatOptionalValue(formData.get("reportHeader")),
                  reportFooter: formatOptionalValue(formData.get("reportFooter")),
                  signatureName: formatOptionalValue(formData.get("signatureName")),
                  signatureTitle: formatOptionalValue(formData.get("signatureTitle")),
                  contactInformation: formatOptionalValue(formData.get("contactInformation")),
                },
              });
              setStatus("Saved");
            } catch {
              setStatus("Save failed");
            }
          }}
        >
          <SectionCard title="Organization profile" description="These details set the reporting voice and ownership model for the rest of the workspace.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Organization name">
                <input className={fieldClass} defaultValue={organization.name} name="name" />
              </Field>
              <Field label="Sector">
                <input className={fieldClass} defaultValue={organization.sector} name="sector" />
              </Field>
              <Field label="Location">
                <input className={fieldClass} defaultValue={organization.location} name="location" />
              </Field>
              <Field label="Website">
                <input className={fieldClass} defaultValue={organization.website ?? ""} name="website" />
              </Field>
              <Field label="Employee count">
                <input className={fieldClass} defaultValue={organization.employeeCount} min={1} name="employeeCount" type="number" />
              </Field>
              <Field label="Risk owner">
                <input className={fieldClass} defaultValue={organization.riskOwner} name="riskOwner" />
              </Field>
              <Field label="Cyber focal point">
                <input className={fieldClass} defaultValue={organization.cyberFocalPoint} name="cyberFocalPoint" />
              </Field>
              <Field label="ICT support status">
                <select className={fieldClass} defaultValue={organization.ictSupportStatus} name="ictSupportStatus">
                  {ictSupportOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Cloud usage status">
                <select className={fieldClass} defaultValue={organization.cloudUsageStatus} name="cloudUsageStatus">
                  {cloudUsageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="md:col-span-2 xl:col-span-3">
                <Field label="Company profile" hint="Keep this concise and written in the same tone you want reflected in reports and summaries.">
                  <textarea className={fieldClass} defaultValue={organization.companyProfile ?? ""} name="companyProfile" rows={4} />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Contacts and cadence" description="These fields help the platform know who should be notified, who signs off, and how often the operating loop should run.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Primary contact name">
                <input className={fieldClass} defaultValue={organization.contacts?.primaryName ?? ""} name="primaryName" />
              </Field>
              <Field label="Primary contact email">
                <input className={fieldClass} defaultValue={organization.contacts?.primaryEmail ?? ""} name="primaryEmail" />
              </Field>
              <Field label="Primary contact phone">
                <input className={fieldClass} defaultValue={organization.contacts?.primaryPhone ?? ""} name="primaryPhone" />
              </Field>
              <Field label="Compliance lead">
                <input className={fieldClass} defaultValue={organization.contacts?.complianceLead ?? ""} name="complianceLead" />
              </Field>
              <Field label="Compliance email">
                <input className={fieldClass} defaultValue={organization.contacts?.complianceEmail ?? ""} name="complianceEmail" />
              </Field>
              <Field label="Technical lead">
                <input className={fieldClass} defaultValue={organization.contacts?.technicalLead ?? ""} name="technicalLead" />
              </Field>
              <Field label="Technical email">
                <input className={fieldClass} defaultValue={organization.contacts?.technicalEmail ?? ""} name="technicalEmail" />
              </Field>
              <Field label="Reporting frequency">
                <select className={fieldClass} defaultValue={organization.preferences?.reportingFrequency ?? "monthly"} name="reportingFrequency">
                  {reportingFrequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Reminder cadence">
                <select className={fieldClass} defaultValue={organization.preferences?.reminderCadence ?? "weekly"} name="reminderCadence">
                  {reminderCadenceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Language preference">
                <select className={fieldClass} defaultValue={organization.preferences?.languagePreference ?? "English"} name="languagePreference">
                  {languagePreferenceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm">
                <input defaultChecked={organization.preferences?.notificationEmail ?? true} name="notificationEmail" type="checkbox" />
                <span>
                  <span className="font-medium">Email alerts</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Send key reminders and review prompts through email.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm">
                <input defaultChecked={organization.preferences?.notificationDashboard ?? true} name="notificationDashboard" type="checkbox" />
                <span>
                  <span className="font-medium">Dashboard reminders</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Keep in-product prompts active for action items and reviews.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm">
                <input defaultChecked={organization.preferences?.weeklyDigest ?? true} name="weeklyDigest" type="checkbox" />
                <span>
                  <span className="font-medium">Weekly digest</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Summarize scores, high risks, missing evidence, and pending actions once a week.</span>
                </span>
              </label>
            </div>
          </SectionCard>

          <SectionCard title="Framework scope and report identity" description="These fields influence how the workspace explains itself, what baseline expectations it highlights, and how exported material is branded.">
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {frameworkOptions.map((framework) => (
                    <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm" key={framework}>
                      <input defaultChecked={(organization.selectedFrameworks ?? []).includes(framework)} name="selectedFrameworks" type="checkbox" value={framework} />
                      <span>
                        <span className="font-medium">{framework}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">Use this framework as part of the organization-level readiness and report narrative.</span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Brand short name">
                    <input className={fieldClass} defaultValue={organization.branding?.shortName ?? organization.name} name="shortName" />
                  </Field>
                  <Field label="Logo URL">
                    <input className={fieldClass} defaultValue={organization.branding?.logoUrl ?? ""} name="logoUrl" />
                  </Field>
                  <Field label="Primary color">
                    <input className={fieldClass} defaultValue={organization.branding?.primaryColor ?? "#0f766e"} name="primaryColor" />
                  </Field>
                  <Field label="Accent color">
                    <input className={fieldClass} defaultValue={organization.branding?.accentColor ?? "#f59e0b"} name="accentColor" />
                  </Field>
                  <Field label="Signature name">
                    <input className={fieldClass} defaultValue={organization.branding?.signatureName ?? ""} name="signatureName" />
                  </Field>
                  <Field label="Signature title">
                    <input className={fieldClass} defaultValue={organization.branding?.signatureTitle ?? ""} name="signatureTitle" />
                  </Field>
                </div>

                <Field label="Report header">
                  <textarea className={fieldClass} defaultValue={organization.branding?.reportHeader ?? ""} name="reportHeader" rows={3} />
                </Field>
                <Field label="Report footer">
                  <textarea className={fieldClass} defaultValue={organization.branding?.reportFooter ?? ""} name="reportFooter" rows={3} />
                </Field>
                <Field label="Report contact information">
                  <textarea className={fieldClass} defaultValue={organization.branding?.contactInformation ?? ""} name="contactInformation" rows={3} />
                </Field>
              </div>

              <div className="rounded-[1.75rem] border border-border/70 bg-muted/20 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ background: organization.branding?.primaryColor ?? "#0f766e" }}
                  >
                    <BellRing className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{organization.branding?.shortName ?? organization.name}</div>
                    <div className="text-sm text-muted-foreground">{organization.preferences?.reportingFrequency ?? "monthly"} reporting cadence</div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Report header</div>
                    <div className="mt-2 text-sm text-muted-foreground">{organization.branding?.reportHeader || "No custom report header yet."}</div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Selected frameworks</div>
                    <div className="mt-2 text-sm text-muted-foreground">{(organization.selectedFrameworks ?? []).join(", ") || "No frameworks selected yet."}</div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Report signature</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {organization.branding?.signatureName ? `${organization.branding.signatureName}${organization.branding.signatureTitle ? `, ${organization.branding.signatureTitle}` : ""}` : "No signature identity configured yet."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Save settings</Button>
            <span className="text-sm text-muted-foreground">These changes update the current organization record and keep existing seeded workflow data intact.</span>
          </div>
        </form>
      )}
    </ModulePage>
  );
}

export function AdminPage() {
  const dashboard = useQuery(api.dashboard.getOverview);
  const actionPlan = useQuery(api.tasks.getActionPlan, {});

  const overview = dashboard && !dashboard.needsOnboarding ? dashboard : null;
  const watchlist = overview
    ? [
        {
          title: "Generated action queue health",
          detail: `${actionPlan?.summary.active ?? 0} active actions with ${actionPlan?.summary.critical ?? 0} currently marked critical.`,
          href: "/action-plan" as const,
        },
        {
          title: "Recent audit activity",
          detail: `${overview.recentActivity.length} recent audit events are available to review from the current organization workspace.`,
          href: "/dashboard" as const,
        },
        {
          title: "Reports and previews",
          detail: `${overview.reports.length} stored reports and ${overview.reportPreviews.length} live preview families are available.`,
          href: "/reports" as const,
        },
      ]
    : [];

  return (
    <ModulePage
      title="Administration"
      description="Phase 1 admin keeps the system understandable: who owns the workspace, how assistant grounding works, and which operational signals still need attention."
      icon={Users}
      form={null}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Membership",
              value: overview?.membership?.role ?? "Pending",
              detail: "Current role for the signed-in user inside the active organization.",
              tone: "purple",
            },
            {
              label: "Audit Events",
              value: `${overview?.recentActivity.length ?? 0}`,
              detail: "Recent organization activity is available for review and later automation.",
              tone: "green",
            },
            {
              label: "Stored Reports",
              value: `${overview?.reports.length ?? 0}`,
              detail: "Report history is retained separately from the live preview selectors.",
              tone: "orange",
            },
            {
              label: "Assistant Runtime",
              value: "OpenAI",
              detail: "Assistant output is model-backed but still grounded in stored records, scoring, and action-plan state.",
              tone: "green",
            },
          ]}
        />
      }
    >
      <SectionCard title="Platform guardrails" description="These are the current rules that keep the command center explainable for operators, reviewers, and future automation.">
        <LinkedRecordStack
          items={[
            {
              title: "Dashboard scores are data-backed",
              detail: "The seven domain scores and the overall FC237 score do not use artificial minimum floors.",
            },
            {
              title: "Generated actions stay idempotent",
              detail: "Task regeneration updates stable generated keys instead of spamming duplicates every time a score changes.",
            },
            {
              title: "Policy help is template-based in Phase 1",
              detail: "The workspace can support policy drafting and approvals without introducing a hard dependency on a live external model.",
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Operational watchlist" description="This is the admin view of where the workspace still needs attention.">
        {overview ? (
          <LinkedRecordStack items={watchlist} />
        ) : (
          <EmptyState title="Admin view pending onboarding" message="Create the organization first so the admin page can show real membership, audit, reporting, and action-generation signals." />
        )}
      </SectionCard>

      {overview ? (
        <SectionCard title="Recent activity snapshot" description="A compact view of the latest platform and governance events for the active organization.">
          <div className="grid gap-3">
            {overview.recentActivity.slice(0, 5).map((event: any) => (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3" key={event._id}>
                <div>
                  <div className="text-sm font-semibold">{event.action}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {event.entityType}
                    {event.entityId ? ` · ${event.entityId}` : ""}
                  </div>
                </div>
                <StatusBadge tone={statusTone(event.entityType)}>{new Date(event.createdAt).toLocaleDateString()}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </ModulePage>
  );
}
