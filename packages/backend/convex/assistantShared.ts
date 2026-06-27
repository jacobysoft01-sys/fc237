export type AssistantMode = "Ask" | "Assessment" | "Recommendation" | "Evidence" | "Incident" | "Report" | "Policy";

export type AssistantResponse = {
  mode: AssistantMode;
  answer: string;
  identifiedRisk: string;
  recommendedActions: string[];
  priority: string;
  evidenceToKeep: string[];
  nextStep: string;
  escalationNotice: string;
  referencedScore?: string;
  cameroonContext: string;
  disclaimer: string;
  provider: string;
  providerModel: string;
  deliveryNote?: string;
};

const DEFAULT_CAMEROON_CONTEXT =
  "Ground recommendations in Cameroon-first governance practice: treat Law No. 2010/012 of 21 December 2010 on cybersecurity and cybercriminality as a standing cyber baseline, respect the existing electronic communications and e-commerce framework, and treat MINPOSTEL's 2 December 2024 personal-data bill update as evolving legal context unless current enactment is separately confirmed.";

const DEFAULT_DISCLAIMER =
  "This assistant supports operational compliance and governance planning for Cameroon-based organizations. It is not a substitute for Cameroonian legal advice, sector regulator guidance, or incident-response specialists.";

const FC237_WORKFLOW_GUIDE =
  "Initial Questionnaire -> Dashboard -> Inventory -> Risk Assessment -> Controls -> Evidence -> Maturity -> Reports -> Continuous Improvement.";

const assistantResponseSchema = {
  type: "object",
  properties: {
    mode: {
      type: "string",
      enum: ["Ask", "Assessment", "Recommendation", "Evidence", "Incident", "Report", "Policy"],
    },
    answer: { type: "string" },
    identifiedRisk: { type: "string" },
    recommendedActions: {
      type: "array",
      items: { type: "string" },
    },
    priority: { type: "string" },
    evidenceToKeep: {
      type: "array",
      items: { type: "string" },
    },
    nextStep: { type: "string" },
    escalationNotice: { type: "string" },
    referencedScore: { type: "string" },
    cameroonContext: { type: "string" },
    disclaimer: { type: "string" },
    provider: { type: "string" },
    providerModel: { type: "string" },
    deliveryNote: { type: "string" },
  },
  required: [
    "mode",
    "answer",
    "identifiedRisk",
    "recommendedActions",
    "priority",
    "evidenceToKeep",
    "nextStep",
    "escalationNotice",
    "referencedScore",
    "cameroonContext",
    "disclaimer",
    "provider",
    "providerModel",
  ],
  additionalProperties: false,
} as const;

export function getAssistantResponseFormatSchema() {
  return assistantResponseSchema;
}

export function detectMode(content: string): AssistantMode {
  const text = content.toLowerCase();
  if (text.includes("assessment") || text.includes("readiness") || text.includes("maturity")) return "Assessment";
  if (text.includes("evidence") || text.includes("artifact") || text.includes("upload")) return "Evidence";
  if (text.includes("incident") || text.includes("breach") || text.includes("phishing") || text.includes("hacked")) return "Incident";
  if (text.includes("report") || text.includes("pdf") || text.includes("summary")) return "Report";
  if (text.includes("policy") || text.includes("draft")) return "Policy";
  if (text.includes("recommend") || text.includes("vendor") || text.includes("risk") || text.includes("action")) {
    return "Recommendation";
  }
  return "Ask";
}

function summarizeList(items: string[], fallback: string) {
  return items.length > 0 ? items.join("; ") : fallback;
}

function truncate(value: string, max = 280) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

export function buildCameroonSystemPrompt(organizationName: string) {
  return [
    `You are the FC237 AI governance and compliance assistant for ${organizationName}.`,
    "Your job is to advise platform users using the real FC237 workspace state they are given.",
    "Default to Cameroon-first compliance and governance guidance for SMEs, public-interest organizations, and growing digital businesses.",
    "Treat Cameroon cybersecurity, electronic communications, and e-commerce obligations as the baseline operating context.",
    "Use concrete dates whenever you mention legal or regulatory developments.",
    "Important Cameroon legal framing: Cameroon has an established cyber law baseline through Law No. 2010/012 of 21 December 2010 on cybersecurity and cybercriminality. MINPOSTEL reported on 2 December 2024 that Parliament adopted a bill on the protection of personal data. Unless the user provides newer verified legal status, treat that personal-data development as evolving legislative context instead of confidently stating final enactment or enforcement details.",
    "Practical institutional framing: ANTIC is an important Cameroon cybersecurity and information-system security actor. Favor pragmatic controls such as access control, incident logging, evidence retention, vendor due diligence, and data-handling discipline that fit Cameroon-based operating realities.",
    "Be operational, concise, and decisive. Tie every answer back to the workspace data when possible.",
    `Always teach the FC237 operating flow explicitly: ${FC237_WORKFLOW_GUIDE}`,
    "If the user sounds unsure, explain what the current stage means, why it matters, and which module they should open next.",
    "Do not invent Cameroon laws, regulators, filing obligations, or deadlines. If the answer would require current legal confirmation, say so plainly and recommend local counsel or the relevant regulator.",
    "Do not answer like a generic chatbot. Prioritize the user's next best governance step, the related risk, the evidence they should keep, and the escalation threshold.",
    "Return only valid JSON matching the requested schema.",
  ].join("\n");
}

export function buildAssistantWorkspaceContext(args: {
  organization: any;
  overview: any;
  reportPreview: any;
  knowledgeBaseEntries: any[];
}) {
  const { organization, overview, reportPreview, knowledgeBaseEntries } = args;
  const domainScores = (overview?.domainScores ?? [])
    .map((domain: any) => `${domain.label}: ${domain.score}% (${domain.status})`)
    .join(" | ");
  const topRisks = (overview?.topRisks ?? [])
    .slice(0, 5)
    .map((risk: any) => `${risk.title} [${risk.riskLevel}] owner=${risk.owner} score=${risk.riskScore}`)
    .join(" | ");
  const nextActions = (overview?.nextActions ?? [])
    .slice(0, 6)
    .map((task: any) => `${task.title} [${task.priority}] due=${task.dueDate} status=${task.status}`)
    .join(" | ");
  const readinessQuestions = (overview?.readiness?.questions ?? [])
    .map((question: any) => `${question.label}: ${question.score}/5`)
    .join(" | ");
  const policyPreview = overview?.policyRollup
    ? `total=${overview.policyRollup.total}, missing_priority=${overview.policyRollup.missingPriorityPolicies}, draft_or_expired=${overview.policyRollup.draftOrExpired}`
    : "none";
  const vendorPreview = overview?.vendorRollup
    ? `total=${overview.vendorRollup.total}, weak=${overview.vendorRollup.weak}, outstanding_gaps=${overview.vendorRollup.outstandingGaps}`
    : "none";
  const evidencePreview = overview?.evidenceRollup
    ? `accepted_coverage=${overview.evidenceRollup.acceptedCoverage}%, submitted_coverage=${overview.evidenceRollup.submittedCoverage}%, required_slots=${overview.evidenceRollup.requiredSlots}`
    : "none";
  const knowledgeSummary = knowledgeBaseEntries.length
    ? knowledgeBaseEntries
        .slice(0, 5)
        .map(
          (entry) =>
            `${entry.title} (${entry.category}/${entry.priority}): ${truncate(entry.content)} | actions=${summarizeList(entry.recommendedActions ?? [], "none")}`,
        )
        .join(" | ")
    : "No curated knowledge base entries are stored yet.";

  return [
    `Today: ${new Date().toISOString().slice(0, 10)}`,
    `Organization: ${organization?.name ?? "Unknown"} | sector=${organization?.sector ?? "Unknown"} | location=${organization?.location ?? "Unknown"} | size=${organization?.sizeCategory ?? "Unknown"}`,
    `Organization profile: risk_owner=${organization?.riskOwner ?? "Unknown"} | cyber_focal_point=${organization?.cyberFocalPoint ?? "Unknown"} | frameworks=${summarizeList(organization?.selectedFrameworks ?? [], "none selected")}`,
    `Required FC237 workflow: ${FC237_WORKFLOW_GUIDE}`,
    `Overall score: ${overview?.score?.overall ?? 0}% (${overview?.score?.status ?? "Unknown"})`,
    `Domain scores: ${domainScores || "No domain scores available."}`,
    `Assistant insight: ${overview?.assistantInsight?.title ?? "Unknown"} | ${overview?.assistantInsight?.summary ?? "No insight available."}`,
    `Top risks: ${topRisks || "No urgent risks available."}`,
    `Next actions: ${nextActions || "No active actions available."}`,
    `Evidence rollup: ${evidencePreview}`,
    `Vendor rollup: ${vendorPreview}`,
    `Policy rollup: ${policyPreview}`,
    `Incident rollup: total=${overview?.incidentRollup?.total ?? 0}, unresolved=${overview?.incidentRollup?.unresolved ?? 0}`,
    `AI rollup: total=${overview?.aiRollup?.total ?? 0}, customer_facing=${overview?.aiRollup?.customerFacing ?? 0}, pending_approval=${overview?.aiRollup?.pendingApproval ?? 0}`,
    `Readiness questions: ${readinessQuestions || "No readiness answers available."}`,
    `Report preview: ${reportPreview?.complianceSummary?.summary ?? "No report preview available."}`,
    `Knowledge base: ${knowledgeSummary}`,
    `Cameroon context reminder: ${DEFAULT_CAMEROON_CONTEXT}`,
  ].join("\n");
}

export function extractResponseText(responsePayload: any) {
  if (typeof responsePayload?.output_text === "string" && responsePayload.output_text.trim().length > 0) {
    return responsePayload.output_text;
  }

  const contentParts = Array.isArray(responsePayload?.output)
    ? responsePayload.output.flatMap((item: any) =>
        Array.isArray(item?.content)
          ? item.content
              .filter((content: any) => content?.type === "output_text" && typeof content?.text === "string")
              .map((content: any) => content.text)
          : [],
      )
    : [];

  return contentParts.join("\n").trim();
}

export function normalizeAssistantResponse(payload: any, fallbackMode: AssistantMode, providerModel: string): AssistantResponse {
  const response = payload && typeof payload === "object" ? payload : {};

  return {
    mode: (response.mode as AssistantMode) ?? fallbackMode,
    answer: String(response.answer ?? "").trim(),
    identifiedRisk: String(response.identifiedRisk ?? "No specific risk was identified.").trim(),
    recommendedActions: Array.isArray(response.recommendedActions)
      ? response.recommendedActions.map((item: unknown) => String(item)).filter(Boolean)
      : [],
    priority: String(response.priority ?? "Moderate").trim(),
    evidenceToKeep: Array.isArray(response.evidenceToKeep)
      ? response.evidenceToKeep.map((item: unknown) => String(item)).filter(Boolean)
      : [],
    nextStep: String(response.nextStep ?? "Open the dashboard and review the next recommended action.").trim(),
    escalationNotice: String(response.escalationNotice ?? "Escalate when a legal, security, or customer-impact threshold is crossed.").trim(),
    referencedScore: String(response.referencedScore ?? "").trim(),
    cameroonContext: String(response.cameroonContext ?? DEFAULT_CAMEROON_CONTEXT).trim(),
    disclaimer: String(response.disclaimer ?? DEFAULT_DISCLAIMER).trim(),
    provider: String(response.provider ?? "OpenAI Responses API").trim(),
    providerModel: String(response.providerModel ?? providerModel).trim(),
    deliveryNote: typeof response.deliveryNote === "string" ? response.deliveryNote.trim() : undefined,
  };
}

export function parseAssistantResponse(rawText: string, fallbackMode: AssistantMode, providerModel: string) {
  try {
    return normalizeAssistantResponse(JSON.parse(rawText), fallbackMode, providerModel);
  } catch {
    return null;
  }
}

export function buildFallbackResponse(
  mode: AssistantMode,
  overview: any,
  prompt: string,
  options: { fallbackReason?: string; deliveryNote?: string; provider?: string; providerModel?: string; reportPreview?: any } = {},
): AssistantResponse {
  const lowest = [...(overview?.domainScores ?? [])].sort((left: any, right: any) => left.score - right.score)[0];
  const topRisk = overview?.topRisks?.[0];
  const firstAction = overview?.nextActions?.[0];
  const reportSummary = options.reportPreview?.complianceSummary?.summary;
  const promptText = prompt.toLowerCase();
  const provider = options.provider ?? "FC237 fallback guidance";
  const providerModel = options.providerModel ?? "workspace-grounded-fallback";
  const deliveryNote = options.deliveryNote ?? options.fallbackReason;

  if (mode === "Assessment") {
    return {
      mode,
      answer: `The latest readiness posture is ${(overview?.score?.status ?? "unknown").toLowerCase()} at ${overview?.score?.overall ?? 0}%. ${(lowest?.label ?? "Readiness")} is the weakest domain right now, so the next assessment cycle should focus there first.`,
      identifiedRisk:
        topRisk?.title ??
        "Readiness gaps can hide weak identity controls, missing vendor review, or incomplete incident preparation.",
      recommendedActions: (overview?.nextActions ?? []).slice(0, 3).map((task: any) => task.title),
      priority: lowest?.status ?? "Moderate",
      evidenceToKeep: ["assessment responses", "scorecard snapshot", "follow-up action log"],
      nextStep: firstAction ? `Review the dashboard, then move to "${firstAction.title}" and assign an owner.` : "Open the dashboard, then continue through inventory, risk, and controls based on the weakest domain.",
      escalationNotice:
        "Escalate if the assessment reveals customer data exposure, missing administrative access control, or an unresolved critical risk.",
      referencedScore: `${lowest?.label ?? "Readiness"}: ${lowest?.score ?? 0}%`,
      cameroonContext: DEFAULT_CAMEROON_CONTEXT,
      disclaimer: DEFAULT_DISCLAIMER,
      provider,
      providerModel,
      deliveryNote,
    };
  }

  if (mode === "Evidence") {
    return {
      mode,
      answer: `Evidence coverage is ${overview?.evidenceRollup?.acceptedCoverage ?? 0}% accepted and ${overview?.evidenceRollup?.submittedCoverage ?? 0}% submitted across ${overview?.evidenceRollup?.requiredSlots ?? 0} required slots. Missing or expired evidence weakens assurance, especially for customer-data and Cameroon-facing audit questions.`,
      identifiedRisk: "Missing or expired evidence weakens assurance even when teams believe controls are in place.",
      recommendedActions: [
        "Link every required control to at least one submitted artifact.",
        "Review expired or pending evidence first.",
        "Capture reviewer names and comments when accepting evidence.",
      ],
      priority: (overview?.evidenceRollup?.acceptedCoverage ?? 0) < 50 ? "High" : "Moderate",
      evidenceToKeep: ["accepted screenshots", "review comments", "vendor documents", "policy approvals"],
      nextStep: "Open the Evidence Vault after reviewing the dashboard, then filter for pending, rejected, or expired records.",
      escalationNotice:
        "Escalate when a high-priority control has no evidence before an audit, customer review, or management report.",
      referencedScore: `Evidence Coverage: ${overview?.domainScores?.find((item: any) => item.key === "evidence_coverage")?.score ?? 0}%`,
      cameroonContext: DEFAULT_CAMEROON_CONTEXT,
      disclaimer: DEFAULT_DISCLAIMER,
      provider,
      providerModel,
      deliveryNote,
    };
  }

  if (mode === "Incident") {
    return {
      mode,
      answer: `Incident readiness is ${overview?.domainScores?.find((item: any) => item.key === "incident_readiness")?.score ?? 0}%. ${overview?.incidentRollup?.unresolved ?? 0} incidents are still unresolved, so containment records and escalation discipline should come before cosmetic reporting.`,
      identifiedRisk: "Slow containment or poor documentation can extend business disruption and reduce legal or audit defensibility.",
      recommendedActions: [
        "Record scope, timeline, and evidence immediately.",
        "Link the incident to the response policy and related controls.",
        "Close the action plan task only after documenting resolution notes.",
      ],
      priority: (overview?.incidentRollup?.unresolved ?? 0) > 0 ? "High" : "Moderate",
      evidenceToKeep: ["incident timeline", "screenshots", "provider ticket reference", "closure note"],
      nextStep: "Open Incidents after checking the dashboard alerts, then update any open or monitoring cases.",
      escalationNotice:
        "Escalate immediately for ransomware, data leakage, confirmed account compromise, or regulated personal-data exposure.",
      referencedScore: `Incident Readiness: ${overview?.domainScores?.find((item: any) => item.key === "incident_readiness")?.score ?? 0}%`,
      cameroonContext: DEFAULT_CAMEROON_CONTEXT,
      disclaimer: DEFAULT_DISCLAIMER,
      provider,
      providerModel,
      deliveryNote,
    };
  }

  if (mode === "Report") {
    return {
      mode,
      answer: `The current production-ready report is the Compliance Readiness Summary. It should only be exported after you review live scores, top risks, evidence coverage, and any Cameroon-specific legal uncertainty that still needs local confirmation.${reportSummary ? ` ${reportSummary}` : ""}`,
      identifiedRisk: "Reports become misleading when scores are stale or not backed by current linked records.",
      recommendedActions: [
        "Regenerate actions before creating the report.",
        "Review top risks and missing evidence slots.",
        "Confirm policy status and vendor gaps before exporting.",
      ],
      priority: overview?.score?.status ?? "Moderate",
      evidenceToKeep: ["generated readiness summary PDF", "risk register preview", "action plan preview"],
      nextStep: "Open Reports once dashboard, inventory, risk, controls, and evidence signals are current, then generate the Compliance Readiness Summary PDF.",
      escalationNotice:
        "Escalate if the report is being used for a contractual, legal, or regulatory submission and critical gaps remain unresolved.",
      referencedScore: `Overall FC237 Score: ${overview?.score?.overall ?? 0}%`,
      cameroonContext: DEFAULT_CAMEROON_CONTEXT,
      disclaimer: DEFAULT_DISCLAIMER,
      provider,
      providerModel,
      deliveryNote,
    };
  }

  if (mode === "Policy") {
    const draftOrExpired = overview?.policyRollup?.draftOrExpired ?? 0;
    return {
      mode,
      answer: `Policy maturity is ${overview?.domainScores?.find((item: any) => item.key === "policy_maturity")?.score ?? 0}%. ${draftOrExpired} policies are draft or expired, so governance defensibility is weaker than it should be.`,
      identifiedRisk: "Outdated or missing baseline policies weaken approval workflows, evidence collection, and incident discipline.",
      recommendedActions: [
        "Create any missing priority policy types first.",
        "Advance draft policies to in review or approved.",
        "Link policies to controls and supporting evidence.",
      ],
      priority: draftOrExpired > 0 ? "High" : "Moderate",
      evidenceToKeep: ["policy approval note", "review date", "linked evidence references"],
      nextStep: "Open Policies after reviewing controls and risks, then focus on draft, missing, or expired items.",
      escalationNotice:
        "Escalate if a required policy is missing while customer data, AI systems, or unresolved incidents are in scope.",
      referencedScore: `Policy Maturity: ${overview?.domainScores?.find((item: any) => item.key === "policy_maturity")?.score ?? 0}%`,
      cameroonContext: DEFAULT_CAMEROON_CONTEXT,
      disclaimer: DEFAULT_DISCLAIMER,
      provider,
      providerModel,
      deliveryNote,
    };
  }

  if (mode === "Recommendation") {
    const vendorWeak = overview?.vendorRollup?.weak ?? 0;
    const riskMessage =
      promptText.includes("vendor") || vendorWeak > 0
        ? `${vendorWeak} vendor reviews are currently weak or incomplete.`
        : `${overview?.riskRollup?.highOrCritical ?? 0} high or critical risks need treatment.`;
    return {
      mode,
      answer: `Start with the weakest domain, ${lowest?.label ?? "current readiness"}, then close the highest-risk action items with clear owners, dates, and evidence paths.`,
      identifiedRisk: riskMessage,
      recommendedActions: (overview?.nextActions ?? []).slice(0, 4).map((task: any) => task.title),
      priority: lowest?.status ?? "Moderate",
      evidenceToKeep: ["action plan updates", "linked control evidence", "vendor review pack"],
      nextStep: firstAction ? `Review the dashboard, then go to the action plan and progress "${firstAction.title}".` : "Use the dashboard to choose the weakest stage, then generate or review the action plan from current data.",
      escalationNotice:
        "Escalate if a critical risk has no owner, no due date, or no linked control/evidence path.",
      referencedScore: `${lowest?.label ?? "Readiness"}: ${lowest?.score ?? 0}%`,
      cameroonContext: DEFAULT_CAMEROON_CONTEXT,
      disclaimer: DEFAULT_DISCLAIMER,
      provider,
      providerModel,
      deliveryNote,
    };
  }

  return {
    mode,
    answer: `Overall FC237 posture is ${(overview?.score?.status ?? "unknown").toLowerCase()} at ${overview?.score?.overall ?? 0}%. ${overview?.assistantInsight?.summary ?? "Review the dashboard and next actions to choose the next best governance step."}`,
    identifiedRisk: topRisk?.title ?? "The main risk is losing sight of the next highest-value action.",
    recommendedActions: overview?.assistantInsight?.recommendedActions ?? [],
    priority: overview?.score?.status ?? "Moderate",
    evidenceToKeep: ["dashboard snapshot", "risk register", "action plan summary"],
    nextStep: firstAction ? `Start with "${firstAction.title}" after reviewing the dashboard and current journey stage.` : "Open the dashboard and continue through the FC237 workflow from inventory to improvement.",
    escalationNotice:
      "Escalate when a critical risk, missing incident capability, or unapproved customer-facing AI workflow remains open.",
    referencedScore: `Overall FC237 Score: ${overview?.score?.overall ?? 0}%`,
    cameroonContext: DEFAULT_CAMEROON_CONTEXT,
    disclaimer: DEFAULT_DISCLAIMER,
    provider,
    providerModel,
    deliveryNote,
  };
}
