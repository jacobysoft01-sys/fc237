import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  average,
  clampScore,
  hasText,
  isPastDate,
  maturityDomains,
  normalizeFivePoint,
  percent,
  readinessQuestionBank,
  requiredPolicyTypes,
  scoreBand,
  todayIso,
  unique,
} from "./_phase1";

type ReadCtx = QueryCtx | MutationCtx;

export type WorkspaceSnapshot = {
  organization: Doc<"organizations">;
  cloudServices: Doc<"cloudServices">[];
  aiSystems: Doc<"aiSystems">[];
  dataAssets: Doc<"dataAssets">[];
  assessments: Doc<"assessments">[];
  latestReadinessAssessment: Doc<"assessments"> | null;
  readinessResponses: Doc<"assessmentResponses">[];
  risks: Doc<"risks">[];
  controls: Doc<"controls">[];
  vendorEvaluations: Doc<"vendorEvaluations">[];
  evidence: Doc<"evidence">[];
  incidents: Doc<"incidents">[];
  policies: Doc<"policies">[];
  tasks: Doc<"tasks">[];
  reports: Doc<"reports">[];
  audits: Doc<"auditLogs">[];
};

type DomainScore = {
  key: string;
  label: string;
  score: number;
  status: ReturnType<typeof scoreBand>;
  detail: string;
};

type ActionCandidate = {
  generatedKey: string;
  title: string;
  description: string;
  owner?: string;
  priority: string;
  dueDate: string;
  sourceType: string;
  sourceId?: string;
  relatedRiskId?: Id<"risks">;
  relatedControlId?: Id<"controls">;
  relatedEvidenceId?: Id<"evidence">;
  relatedVendorEvaluationId?: Id<"vendorEvaluations">;
  relatedAssessmentId?: Id<"assessments">;
  relatedIncidentId?: Id<"incidents">;
  relatedPolicyId?: Id<"policies">;
};

function priorityRank(priority: string) {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
    case "high priority":
    case "urgent":
      return 3;
    case "medium":
    case "medium priority":
      return 2;
    default:
      return 1;
  }
}

function isoDateFromCreatedAt(createdAt: number, offsetDays = 14) {
  const date = new Date(createdAt);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function responseScoreMap(responses: Doc<"assessmentResponses">[]) {
  return Object.fromEntries(responses.map((response) => [response.questionKey, response.score])) as Record<string, number>;
}

function safeArray<T>(value: T[] | undefined | null) {
  return value ?? [];
}

function uniqueControlEvidence(evidence: Doc<"evidence">[], filter: (item: Doc<"evidence">) => boolean) {
  return unique(
    evidence
      .filter((item) => item.controlId && filter(item))
      .map((item) => String(item.controlId)),
  );
}

function controlDomain(control: Doc<"controls">) {
  return control.domain ?? control.pillar;
}

function resolveVendorDocumentationGaps(vendor: Doc<"vendorEvaluations">) {
  return vendor.evidenceSection?.outstandingGaps?.length ?? 0;
}

function findPoliciesByType(policies: Doc<"policies">[]) {
  return new Map(policies.map((policy) => [policy.type, policy]));
}

function buildCloudReadiness(snapshot: WorkspaceSnapshot, scores: Record<string, number>): DomainScore {
  const readinessQuestions = ["cloud_inventory", "mfa", "backup", "access_review"];
  const assessmentScore = average(readinessQuestions.map((key) => normalizeFivePoint(scores[key])));
  if (snapshot.cloudServices.length === 0) {
    return {
      key: "cloud_readiness",
      label: "Cloud Readiness",
      score: assessmentScore,
      status: scoreBand(assessmentScore),
      detail: "No cloud services are registered yet, so this score is currently driven by the stored readiness answers.",
    };
  }
  const approvedCoverage = percent(
    snapshot.cloudServices.filter((service) => service.approved).length,
    snapshot.cloudServices.length,
  );
  const ownerCoverage = percent(
    snapshot.cloudServices.filter((service) => hasText(service.owner)).length,
    snapshot.cloudServices.length,
  );
  const score = average([assessmentScore, approvedCoverage, ownerCoverage]);
  return {
    key: "cloud_readiness",
    label: "Cloud Readiness",
    score,
    status: scoreBand(score),
    detail: `${snapshot.cloudServices.length} services tracked, ${approvedCoverage}% approved, ${ownerCoverage}% with owners.`,
  };
}

function buildAiGovernance(snapshot: WorkspaceSnapshot): DomainScore {
  const total = snapshot.aiSystems.length;
  if (total === 0) {
    return {
      key: "ai_governance",
      label: "AI Governance",
      score: 100,
      status: scoreBand(100),
      detail: "No AI systems are registered, so current AI exposure is limited until new AI tools are introduced.",
    };
  }
  const linkedRiskIds = new Set(snapshot.risks.filter((risk) => risk.relatedAiSystemId).map((risk) => String(risk.relatedAiSystemId)));
  const completeness = percent(
    snapshot.aiSystems.reduce((count, system) => {
      const required = [
        hasText(system.businessOwner ?? system.owner),
        hasText(system.technicalOwner),
        hasText(system.department),
        hasText(system.internalExternalFlag),
        hasText(system.usePurpose ?? system.purpose),
        hasText(system.reviewDate),
      ];
      return count + required.filter(Boolean).length;
    }, 0),
    total * 6,
  );
  const riskCoverage = percent(snapshot.aiSystems.filter((system) => linkedRiskIds.has(String(system._id))).length, total);
  const controlCoverage = percent(
    snapshot.aiSystems.filter((system) => safeArray(system.relatedControlIds).length > 0).length,
    total,
  );
  const approvalCoverage = percent(
    snapshot.aiSystems.filter((system) => system.approvalStatus === "approved").length,
    total,
  );
  const vendorCoverage = percent(
    snapshot.aiSystems.filter(
      (system) =>
        Boolean(system.relatedVendorEvaluationId) ||
        snapshot.vendorEvaluations.some((vendor) => vendor.vendorName.toLowerCase() === system.vendor.toLowerCase()),
    ).length,
    total,
  );
  const score = average([completeness, riskCoverage, controlCoverage, approvalCoverage, vendorCoverage]);
  return {
    key: "ai_governance",
    label: "AI Governance",
    score,
    status: scoreBand(score),
    detail: `${total} systems tracked with ${approvalCoverage}% approval coverage.`,
  };
}

function buildRiskManagement(snapshot: WorkspaceSnapshot): DomainScore {
  const total = snapshot.risks.length;
  const scoreCoverage = percent(snapshot.risks.filter((risk) => risk.riskScore > 0).length, total);
  const ownerCoverage = percent(snapshot.risks.filter((risk) => hasText(risk.owner)).length, total);
  const treatmentCoverage = percent(
    snapshot.risks.filter((risk) => hasText(risk.treatmentOption ?? risk.treatmentStatus)).length,
    total,
  );
  const dueDateCoverage = percent(snapshot.risks.filter((risk) => hasText(risk.dueDate)).length, total);
  const controlCoverage = percent(snapshot.risks.filter((risk) => safeArray(risk.relatedControlIds).length > 0).length, total);
  const score = total === 0 ? 0 : average([scoreCoverage, ownerCoverage, treatmentCoverage, dueDateCoverage, controlCoverage]);
  return {
    key: "risk_management",
    label: "Risk Management",
    score,
    status: scoreBand(score),
    detail: total === 0 ? "No risks have been scored yet." : `${total} risks scored, ${controlCoverage}% linked to controls.`,
  };
}

function buildVendorReadiness(snapshot: WorkspaceSnapshot, scores: Record<string, number>): DomainScore {
  const total = snapshot.vendorEvaluations.length;
  const averageVendorScore = total === 0 ? 0 : average(snapshot.vendorEvaluations.map((vendor) => vendor.score));
  const documentationCoverage = percent(
    snapshot.vendorEvaluations.filter((vendor) => resolveVendorDocumentationGaps(vendor) === 0).length,
    total,
  );
  const vendorAssessment = normalizeFivePoint(scores.vendor_review);
  const linkedCoverage = percent(
    snapshot.vendorEvaluations.filter(
      (vendor) => safeArray(vendor.relatedAiSystemIds).length > 0 || safeArray(vendor.relatedCloudServiceIds).length > 0,
    ).length,
    total,
  );
  const score = total === 0 ? vendorAssessment : average([vendorAssessment, averageVendorScore, documentationCoverage, linkedCoverage]);
  return {
    key: "vendor_readiness",
    label: "Vendor Readiness",
    score,
    status: scoreBand(score),
    detail: total === 0 ? "No vendor evaluations submitted yet." : `${total} vendors assessed, ${documentationCoverage}% with no documented gaps.`,
  };
}

function buildEvidenceCoverage(snapshot: WorkspaceSnapshot, scores: Record<string, number>) {
  const requiredControls = snapshot.controls.filter(
    (control) => control.evidenceRequired && control.implementationStatus !== "not_applicable",
  );
  const requiredSlots = requiredControls.length;
  const submittedControlIds = uniqueControlEvidence(
    snapshot.evidence,
    (item) => ["submitted", "accepted"].includes(item.status),
  );
  const acceptedControlIds = uniqueControlEvidence(snapshot.evidence, (item) => item.status === "accepted");
  const submittedCoverage = percent(
    submittedControlIds.length,
    requiredSlots,
  );
  const acceptedCoverage = percent(
    acceptedControlIds.length,
    requiredSlots,
  );
  const evidenceAssessment = normalizeFivePoint(scores.evidence_maturity);
  const score = average([submittedCoverage, acceptedCoverage, evidenceAssessment]);
  return {
    card: {
      key: "evidence_coverage",
      label: "Evidence Coverage",
      score,
      status: scoreBand(score),
      detail: `${acceptedCoverage}% accepted coverage across ${requiredSlots} required control slots.`,
    } satisfies DomainScore,
    rollup: {
      requiredSlots,
      submittedSlots: submittedControlIds.length,
      acceptedSlots: acceptedControlIds.length,
      submittedCoverage,
      acceptedCoverage,
      expiringCount: snapshot.evidence.filter((item) => isPastDate(item.expiryDate)).length,
      missingControlIds: requiredControls
        .filter((control) => !submittedControlIds.includes(String(control._id)))
        .map((control) => control._id),
    },
  };
}

function buildIncidentReadiness(snapshot: WorkspaceSnapshot, scores: Record<string, number>): DomainScore {
  const assessmentScore = normalizeFivePoint(scores.incident_readiness);
  const incidentPolicy = snapshot.policies.find((policy) => policy.type === "incident_response");
  const policyCoverage = incidentPolicy ? (incidentPolicy.status === "approved" ? 100 : 60) : 0;
  const incidentEvidence = snapshot.evidence.filter(
    (item) =>
      item.relatedIncidentId ||
      item.relatedPolicyId === incidentPolicy?._id ||
      item.evidenceType.toLowerCase().includes("incident"),
  );
  const evidenceCoverage = incidentEvidence.length > 0 ? 100 : 0;
  const resolvedCoverage = percent(
    snapshot.incidents.filter((incident) => ["resolved", "closed"].includes(incident.status)).length,
    snapshot.incidents.length || 1,
  );
  const score = average([assessmentScore, policyCoverage, evidenceCoverage, resolvedCoverage]);
  return {
    key: "incident_readiness",
    label: "Incident Readiness",
    score,
    status: scoreBand(score),
    detail: `${snapshot.incidents.length} incidents logged and ${incidentEvidence.length} incident-related evidence items stored.`,
  };
}

function buildPolicyMaturity(snapshot: WorkspaceSnapshot): DomainScore {
  const byType = findPoliciesByType(snapshot.policies);
  const presentCoverage = percent(
    requiredPolicyTypes.filter((policy) => byType.has(policy.key)).length,
    requiredPolicyTypes.length,
  );
  const approvedCoverage = percent(
    requiredPolicyTypes.filter((policy) => byType.get(policy.key)?.status === "approved").length,
    requiredPolicyTypes.length,
  );
  const currentCoverage = percent(
    requiredPolicyTypes.filter((policy) => {
      const current = byType.get(policy.key);
      if (!current) return false;
      return !isPastDate(current.expiryDate ?? current.reviewDate);
    }).length,
    requiredPolicyTypes.length,
  );
  const score = average([presentCoverage, approvedCoverage, currentCoverage]);
  return {
    key: "policy_maturity",
    label: "Policy Maturity",
    score,
    status: scoreBand(score),
    detail: `${approvedCoverage}% of priority policy types are approved and ${currentCoverage}% are current.`,
  };
}

function buildMaturitySupport(domainScores: DomainScore[], organization: Doc<"organizations">) {
  const stored = organization.maturityDomainScores;
  const lookup = new Map(domainScores.map((score) => [score.key, score.score]));
  const domainValues = {
    governance: stored?.governance ?? Math.max(1, Math.round((lookup.get("policy_maturity") ?? 0) / 20)),
    inventory: stored?.inventory ?? Math.max(1, Math.round((lookup.get("cloud_readiness") ?? 0) / 20)),
    risk: stored?.risk ?? Math.max(1, Math.round((lookup.get("risk_management") ?? 0) / 20)),
    vendor: stored?.vendor ?? Math.max(1, Math.round((lookup.get("vendor_readiness") ?? 0) / 20)),
    incident: stored?.incident ?? Math.max(1, Math.round((lookup.get("incident_readiness") ?? 0) / 20)),
    evidence: stored?.evidence ?? Math.max(1, Math.round((lookup.get("evidence_coverage") ?? 0) / 20)),
    policy: stored?.policy ?? Math.max(1, Math.round((lookup.get("policy_maturity") ?? 0) / 20)),
  };
  const domains = maturityDomains.map((domain) => ({
    domain: domain.label,
    key: domain.key,
    score: Math.max(1, Math.min(5, domainValues[domain.key as keyof typeof domainValues] ?? organization.maturityLevel)),
  }));
  return {
    level: organization.maturityLevel,
    domains,
    nextLevelActions: [
      "Assign accountable owners for every weak domain.",
      "Link evidence to required controls and policy reviews.",
      "Close missing vendor documents before the next reporting cycle.",
      "Re-run readiness and maturity scoring after closing critical actions.",
    ],
  };
}

function buildAssistantInsight(domainScores: DomainScore[], snapshot: WorkspaceSnapshot, nextActions: Doc<"tasks">[]) {
  const lowest = [...domainScores].sort((a, b) => a.score - b.score)[0];
  const urgentRisk = snapshot.risks.find((risk) => ["critical", "high"].includes(risk.riskLevel));
  const firstAction = nextActions[0];
  const actionText = firstAction ? `${firstAction.title} by ${firstAction.dueDate}.` : "Generate actions after your next assessment to see an execution queue.";

  const modes: Record<string, string> = {
    cloud_readiness: "Assessment",
    ai_governance: "Recommendation",
    risk_management: "Recommendation",
    vendor_readiness: "Recommendation",
    evidence_coverage: "Evidence",
    incident_readiness: "Incident",
    policy_maturity: "Policy",
  };

  return {
    mode: modes[lowest.key] ?? "Ask",
    title: `${lowest.label} is the main blocker`,
    summary: `${lowest.label} is currently ${lowest.status.toLowerCase()} at ${lowest.score}%. ${actionText}`,
    recommendedActions: [
      firstAction?.title ?? "Complete the latest readiness assessment.",
      urgentRisk ? `Treat high risk: ${urgentRisk.title}.` : "Link every high-priority control to evidence.",
      `Re-run the ${lowest.label.toLowerCase()} workflow after updates.`,
    ],
  };
}

function enrichTaskLinks(snapshot: WorkspaceSnapshot, task: Doc<"tasks">) {
  const risk = task.relatedRiskId ? snapshot.risks.find((item) => item._id === task.relatedRiskId) : null;
  const control = task.relatedControlId ? snapshot.controls.find((item) => item._id === task.relatedControlId) : null;
  const evidence = task.relatedEvidenceId ? snapshot.evidence.find((item) => item._id === task.relatedEvidenceId) : null;
  const vendor = task.relatedVendorEvaluationId
    ? snapshot.vendorEvaluations.find((item) => item._id === task.relatedVendorEvaluationId)
    : null;
  const incident = task.relatedIncidentId ? snapshot.incidents.find((item) => item._id === task.relatedIncidentId) : null;
  const policy = task.relatedPolicyId ? snapshot.policies.find((item) => item._id === task.relatedPolicyId) : null;
  const assessment = task.relatedAssessmentId
    ? snapshot.assessments.find((item) => item._id === task.relatedAssessmentId)
    : null;

  return {
    ...task,
    linkedSummary: {
      risk: risk ? { id: risk._id, title: risk.title, level: risk.riskLevel } : null,
      control: control ? { id: control._id, title: control.name, status: control.implementationStatus } : null,
      evidence: evidence ? { id: evidence._id, title: evidence.title, status: evidence.status } : null,
      vendor: vendor ? { id: vendor._id, title: vendor.vendorName, score: vendor.score } : null,
      incident: incident ? { id: incident._id, title: incident.title, status: incident.status } : null,
      policy: policy ? { id: policy._id, title: policy.title, status: policy.status } : null,
      assessment: assessment ? { id: assessment._id, title: assessment.type, score: assessment.score } : null,
    },
  };
}

export async function loadWorkspaceSnapshot(ctx: ReadCtx, organization: Doc<"organizations">): Promise<WorkspaceSnapshot> {
  const organizationId = organization._id;
  const [
    cloudServices,
    aiSystems,
    dataAssets,
    assessments,
    risks,
    controls,
    vendorEvaluations,
    evidence,
    incidents,
    policies,
    tasks,
    reports,
    audits,
  ] = await Promise.all([
    ctx.db.query("cloudServices").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("aiSystems").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("dataAssets").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("assessments").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("risks").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("controls").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("vendorEvaluations").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("evidence").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("incidents").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("policies").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("tasks").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db.query("reports").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
    ctx.db
      .query("auditLogs")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .order("desc")
      .take(10),
  ]);

  const latestReadinessAssessment = [...assessments]
    .filter((assessment) => assessment.type === "readiness")
    .sort((a, b) => (b.submittedAt ?? b.startedAt) - (a.submittedAt ?? a.startedAt))[0] ?? null;

  const readinessResponses = latestReadinessAssessment
    ? await ctx.db
        .query("assessmentResponses")
        .withIndex("by_assessment", (q) => q.eq("assessmentId", latestReadinessAssessment._id))
        .collect()
    : [];

  return {
    organization,
    cloudServices,
    aiSystems,
    dataAssets,
    assessments,
    latestReadinessAssessment,
    readinessResponses,
    risks,
    controls,
    vendorEvaluations,
    evidence,
    incidents,
    policies,
    tasks,
    reports,
    audits,
  };
}

export function buildOverview(snapshot: WorkspaceSnapshot) {
  const readinessScores = responseScoreMap(snapshot.readinessResponses);
  const evidenceCoverage = buildEvidenceCoverage(snapshot, readinessScores);
  const domainScores = [
    buildCloudReadiness(snapshot, readinessScores),
    buildAiGovernance(snapshot),
    buildRiskManagement(snapshot),
    buildVendorReadiness(snapshot, readinessScores),
    evidenceCoverage.card,
    buildIncidentReadiness(snapshot, readinessScores),
    buildPolicyMaturity(snapshot),
  ];

  const overallScore = average(domainScores.map((domain) => domain.score));
  const activeTasks = snapshot.tasks.filter((task) => !["done", "closed"].includes(task.status));
  const nextActions = activeTasks
    .map((task) => enrichTaskLinks(snapshot, task))
    .sort((left, right) => {
      const priorityDiff = priorityRank(right.priority) - priorityRank(left.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return left.dueDate.localeCompare(right.dueDate);
    })
    .slice(0, 8);

  const highRisks = snapshot.risks.filter((risk) => ["critical", "high"].includes(risk.riskLevel));
  const urgentRisks = [...highRisks].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  const policyLookup = findPoliciesByType(snapshot.policies);
  const missingPolicies = requiredPolicyTypes
    .filter((policy) => !policyLookup.has(policy.key))
    .map((policy) => policy.label);

  const assistantInsight = buildAssistantInsight(domainScores, snapshot, activeTasks);

  return {
    score: {
      overall: overallScore,
      status: scoreBand(overallScore),
      readiness: snapshot.organization.readinessScore,
      maturity: snapshot.organization.maturityLevel,
    },
    domainScores,
    nextActions,
    topRisks: urgentRisks,
    riskRollup: {
      total: snapshot.risks.length,
      highOrCritical: highRisks.length,
      byLevel: {
        critical: snapshot.risks.filter((risk) => risk.riskLevel === "critical").length,
        high: snapshot.risks.filter((risk) => risk.riskLevel === "high").length,
        moderate: snapshot.risks.filter((risk) => risk.riskLevel === "moderate").length,
        low: snapshot.risks.filter((risk) => risk.riskLevel === "low").length,
      },
      withoutControls: snapshot.risks.filter((risk) => safeArray(risk.relatedControlIds).length === 0).length,
    },
    evidenceRollup: evidenceCoverage.rollup,
    vendorRollup: {
      total: snapshot.vendorEvaluations.length,
      weak: snapshot.vendorEvaluations.filter((vendor) => vendor.score < 50).length,
      outstandingGaps: snapshot.vendorEvaluations.filter((vendor) => resolveVendorDocumentationGaps(vendor) > 0).length,
    },
    policyRollup: {
      total: snapshot.policies.length,
      missingPriorityPolicies: missingPolicies,
      draftOrExpired: snapshot.policies.filter(
        (policy) => policy.status === "draft" || isPastDate(policy.expiryDate ?? policy.reviewDate),
      ).length,
    },
    incidentRollup: {
      total: snapshot.incidents.length,
      unresolved: snapshot.incidents.filter((incident) => !["resolved", "closed"].includes(incident.status)).length,
    },
    aiRollup: {
      total: snapshot.aiSystems.length,
      customerFacing: snapshot.aiSystems.filter((system) => system.customerFacingFlag).length,
      pendingApproval: snapshot.aiSystems.filter((system) => system.approvalStatus !== "approved").length,
    },
    readiness: {
      latestAssessmentId: snapshot.latestReadinessAssessment?._id ?? null,
      latestAssessmentScore: snapshot.latestReadinessAssessment?.score ?? 0,
      questions: readinessQuestionBank.map((question) => ({
        ...question,
        score: readinessScores[question.key] ?? 0,
      })),
    },
    maturitySupport: buildMaturitySupport(domainScores, snapshot.organization),
    assistantInsight,
    reportPreviews: [
      {
        key: "compliance_readiness_summary",
        title: "Compliance Readiness Summary",
        summary: `Overall FC237 score ${overallScore}% with ${highRisks.length} urgent risks and ${evidenceCoverage.rollup.requiredSlots} required evidence slots.`,
      },
      {
        key: "risk_register_preview",
        title: "Risk Register Preview",
        summary: `${snapshot.risks.length} risks tracked, ${highRisks.length} currently high or critical.`,
      },
      {
        key: "action_plan_preview",
        title: "Action Plan Preview",
        summary: `${activeTasks.length} active action items ordered by priority and due date.`,
      },
    ],
    recentActivity: snapshot.audits,
    controlsNeedingAttention: snapshot.controls
      .filter((control) => control.implementationStatus !== "implemented")
      .slice(0, 6)
      .map((control) => ({
        _id: control._id,
        name: control.name,
        controlKey: control.controlKey,
        status: control.implementationStatus,
        domain: controlDomain(control),
      })),
  };
}

export function buildActionCandidates(snapshot: WorkspaceSnapshot, overview = buildOverview(snapshot)): ActionCandidate[] {
  const candidates: ActionCandidate[] = [];
  const weakestReadiness = overview.domainScores.find((domain) => domain.key === "cloud_readiness");

  if (weakestReadiness && weakestReadiness.score < 60 && snapshot.latestReadinessAssessment) {
    candidates.push({
      generatedKey: `assessment:${snapshot.latestReadinessAssessment._id}`,
      title: "Close readiness assessment gaps",
      description: "Review the latest readiness answers and close the weakest cloud readiness controls before the next reporting cycle.",
      owner: snapshot.organization.riskOwner,
      priority: weakestReadiness.score < 35 ? "critical" : "high",
      dueDate: todayIso(14),
      sourceType: "assessment",
      sourceId: String(snapshot.latestReadinessAssessment._id),
      relatedAssessmentId: snapshot.latestReadinessAssessment._id,
    });
  }

  for (const risk of snapshot.risks.filter((item) => ["high", "critical"].includes(item.riskLevel))) {
    candidates.push({
      generatedKey: `risk:${risk._id}`,
      title: `Treat ${risk.riskLevel} risk: ${risk.title}`,
      description: risk.description ?? risk.remediationStatus ?? "Document treatment, owner, due date, and linked controls.",
      owner: risk.owner || snapshot.organization.riskOwner,
      priority: risk.riskLevel === "critical" ? "critical" : "high",
      dueDate: risk.dueDate ?? isoDateFromCreatedAt(risk.createdAt, 21),
      sourceType: "risk",
      sourceId: String(risk._id),
      relatedRiskId: risk._id,
    });
  }

  const requiredControls = snapshot.controls.filter(
    (control) => control.evidenceRequired && control.implementationStatus !== "not_applicable",
  );
  const evidenceControlIds = new Set(
    uniqueControlEvidence(snapshot.evidence, (item) => ["submitted", "accepted"].includes(item.status)),
  );
  for (const control of requiredControls) {
    if (!evidenceControlIds.has(String(control._id))) {
      candidates.push({
        generatedKey: `control-evidence:${control._id}`,
        title: `Add evidence for ${control.name}`,
        description:
          control.requiredEvidenceDescription ??
          "Submit or link evidence proving this control is designed or operating effectively.",
        owner: control.owner ?? snapshot.organization.cyberFocalPoint,
        priority: control.priority.includes("high") || control.priority === "urgent" ? "high" : "medium",
        dueDate: control.dueDate ?? todayIso(10),
        sourceType: "control",
        sourceId: String(control._id),
        relatedControlId: control._id,
      });
    }
    if (control.implementationStatus !== "implemented") {
      candidates.push({
        generatedKey: `control-status:${control._id}`,
        title: `Implement control: ${control.name}`,
        description:
          control.implementationGuidance ??
          "Move this control from planning into implementation and link the first evidence artifact.",
        owner: control.owner ?? snapshot.organization.cyberFocalPoint,
        priority: control.priority.includes("high") || control.priority === "urgent" ? "high" : "medium",
        dueDate: control.dueDate ?? todayIso(21),
        sourceType: "control",
        sourceId: String(control._id),
        relatedControlId: control._id,
      });
    }
  }

  for (const evidence of snapshot.evidence.filter((item) => item.status === "expired" || isPastDate(item.expiryDate))) {
    candidates.push({
      generatedKey: `evidence:${evidence._id}`,
      title: `Refresh expired evidence: ${evidence.title}`,
      description: "Review the evidence item, upload a current artifact, and capture reviewer feedback.",
      owner: evidence.reviewer ?? snapshot.organization.cyberFocalPoint,
      priority: "high",
      dueDate: todayIso(7),
      sourceType: "evidence",
      sourceId: String(evidence._id),
      relatedEvidenceId: evidence._id,
      relatedControlId: evidence.controlId,
    });
  }

  for (const vendor of snapshot.vendorEvaluations.filter((item) => item.score < 50 || resolveVendorDocumentationGaps(item) > 0)) {
    candidates.push({
      generatedKey: `vendor:${vendor._id}`,
      title: `Close vendor assurance gaps for ${vendor.vendorName}`,
      description:
        resolveVendorDocumentationGaps(vendor) > 0
          ? `Outstanding vendor documents: ${safeArray(vendor.evidenceSection?.outstandingGaps).join(", ")}`
          : "Improve the vendor evaluation score and document remediation for weak vendor controls.",
      owner: vendor.identity?.relationshipOwner ?? snapshot.organization.riskOwner,
      priority: vendor.score < 35 ? "critical" : "high",
      dueDate: vendor.identity?.contractRenewalDate ?? todayIso(21),
      sourceType: "vendor",
      sourceId: String(vendor._id),
      relatedVendorEvaluationId: vendor._id,
    });
  }

  for (const policy of snapshot.policies.filter(
    (item) => item.status === "draft" || isPastDate(item.expiryDate ?? item.reviewDate),
  )) {
    candidates.push({
      generatedKey: `policy:${policy._id}`,
      title: `Advance policy: ${policy.title}`,
      description: "Update the policy review state, close linked gaps, and move it toward approval.",
      owner: policy.owner,
      priority: policy.priority === "critical" ? "critical" : "medium",
      dueDate: policy.expiryDate ?? policy.reviewDate,
      sourceType: "policy",
      sourceId: String(policy._id),
      relatedPolicyId: policy._id,
    });
  }

  for (const baselinePolicy of requiredPolicyTypes.filter(
    (policy) => !snapshot.policies.some((item) => item.type === policy.key),
  )) {
    candidates.push({
      generatedKey: `policy-baseline:${baselinePolicy.key}`,
      title: `Create ${baselinePolicy.label}`,
      description: "Add the baseline policy record so approvals, reviews, and evidence can be tracked.",
      owner: snapshot.organization.cyberFocalPoint,
      priority: baselinePolicy.priority === "critical" ? "critical" : "high",
      dueDate: todayIso(21),
      sourceType: "policy_baseline",
      sourceId: baselinePolicy.key,
    });
  }

  for (const incident of snapshot.incidents.filter((item) => !["resolved", "closed"].includes(item.status))) {
    candidates.push({
      generatedKey: `incident:${incident._id}`,
      title: `Resolve incident: ${incident.title}`,
      description: "Document containment, response actions, and closure notes for this incident.",
      owner: incident.owner ?? snapshot.organization.cyberFocalPoint,
      priority: incident.severity === "critical" ? "critical" : incident.severity === "high" ? "high" : "medium",
      dueDate: todayIso(3),
      sourceType: "incident",
      sourceId: String(incident._id),
      relatedIncidentId: incident._id,
    });
  }

  return candidates;
}

export async function syncGeneratedActions(
  ctx: MutationCtx,
  snapshot: WorkspaceSnapshot,
) {
  const nowValue = Date.now();
  const candidates = buildActionCandidates(snapshot);
  const existingByKey = new Map(
    snapshot.tasks.filter((task) => task.generatedKey).map((task) => [task.generatedKey as string, task]),
  );
  let created = 0;
  let updated = 0;

  for (const candidate of candidates) {
    const existing = existingByKey.get(candidate.generatedKey);
    const patch = {
      title: candidate.title,
      description: candidate.description,
      owner: candidate.owner,
      priority: candidate.priority,
      dueDate: candidate.dueDate,
      sourceType: candidate.sourceType,
      sourceId: candidate.sourceId,
      relatedRiskId: candidate.relatedRiskId,
      relatedControlId: candidate.relatedControlId,
      relatedEvidenceId: candidate.relatedEvidenceId,
      relatedVendorEvaluationId: candidate.relatedVendorEvaluationId,
      relatedAssessmentId: candidate.relatedAssessmentId,
      relatedIncidentId: candidate.relatedIncidentId,
      relatedPolicyId: candidate.relatedPolicyId,
      createdByEngine: true,
      generatedKey: candidate.generatedKey,
      lastEvaluatedAt: nowValue,
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...patch,
        status: existing.status === "done" ? "open" : existing.status,
      });
      updated += 1;
      continue;
    }

    await ctx.db.insert("tasks", {
      organizationId: snapshot.organization._id,
      status: "open",
      createdAt: nowValue,
      ...patch,
    });
    created += 1;
  }

  return { created, updated, generated: candidates.length };
}

export function buildComplianceReport(snapshot: WorkspaceSnapshot) {
  const overview = buildOverview(snapshot);
  const topRisks = [...snapshot.risks].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const topActions = overview.nextActions.slice(0, 8);
  return {
    title: "Compliance Readiness Summary",
    summary: `${snapshot.organization.name} is ${overview.score.status.toLowerCase()} at ${overview.score.overall}% overall readiness.`,
    reportData: {
      organization: {
        name: snapshot.organization.name,
        sector: snapshot.organization.sector,
        location: snapshot.organization.location,
        selectedFrameworks: snapshot.organization.selectedFrameworks ?? [],
      },
      score: overview.score,
      domainScores: overview.domainScores,
      topRisks: topRisks.map((risk) => ({
        title: risk.title,
        level: risk.riskLevel,
        score: risk.riskScore,
        owner: risk.owner,
        treatment: risk.treatmentOption ?? risk.treatmentStatus,
      })),
      controlsNeedingAttention: overview.controlsNeedingAttention,
      evidenceRollup: overview.evidenceRollup,
      nextActions: topActions.map((task) => ({
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        status: task.status,
      })),
      assistantInsight: overview.assistantInsight,
      disclaimer:
        "This report is built from stored FC237 platform data. It supports governance and readiness review but does not replace formal legal, audit, or specialist cybersecurity advice.",
    },
  };
}
