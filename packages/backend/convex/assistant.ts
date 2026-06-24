import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { buildComplianceReport, buildOverview, loadWorkspaceSnapshot } from "./_engine";
import { getActiveOrganization, logAuditEvent, now } from "./_shared";

type AssistantMode = "Ask" | "Assessment" | "Recommendation" | "Evidence" | "Incident" | "Report" | "Policy";

type AssistantResponse = {
  mode: AssistantMode;
  explanation: string;
  identifiedRisk: string;
  recommendedActions: string[];
  priority: string;
  evidenceToKeep: string[];
  nextStep: string;
  escalationNotice: string;
  referencedScore?: string;
};

function detectMode(content: string): AssistantMode {
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

function buildResponse(mode: AssistantMode, overview: ReturnType<typeof buildOverview>, prompt: string): AssistantResponse {
  const lowest = [...overview.domainScores].sort((left, right) => left.score - right.score)[0];
  const topRisk = overview.topRisks[0];
  const firstAction = overview.nextActions[0];
  const report = overview.reportPreviews[0];
  const promptText = prompt.toLowerCase();

  if (mode === "Assessment") {
    return {
      mode,
      explanation: `The latest readiness posture is ${overview.score.status.toLowerCase()} at ${overview.score.overall}%. ${lowest.label} is the weakest domain right now.`,
      identifiedRisk:
        topRisk?.title ??
        "Readiness gaps can hide weak identity controls, missing vendor review, or incomplete incident preparation.",
      recommendedActions: overview.nextActions.slice(0, 3).map((task) => task.title),
      priority: lowest.status,
      evidenceToKeep: ["assessment responses", "scorecard snapshot", "follow-up action log"],
      nextStep: firstAction ? `Move to ${firstAction.title} and assign an owner.` : "Open the readiness module and submit a fresh assessment.",
      escalationNotice:
        "Escalate if the assessment reveals customer data exposure, missing administrative access control, or an unresolved critical risk.",
      referencedScore: `${lowest.label}: ${lowest.score}%`,
    };
  }

  if (mode === "Evidence") {
    return {
      mode,
      explanation: `Evidence coverage is ${overview.evidenceRollup.acceptedCoverage}% accepted and ${overview.evidenceRollup.submittedCoverage}% submitted across ${overview.evidenceRollup.requiredSlots} required slots.`,
      identifiedRisk:
        "Missing or expired evidence weakens assurance even when teams believe controls are in place.",
      recommendedActions: [
        "Link every required control to at least one submitted artifact.",
        "Review expired or pending evidence first.",
        "Capture reviewer names and comments when accepting evidence.",
      ],
      priority: overview.evidenceRollup.acceptedCoverage < 50 ? "High" : "Moderate",
      evidenceToKeep: ["accepted screenshots", "review comments", "vendor documents", "policy approvals"],
      nextStep: "Open the Evidence Vault and filter for pending, rejected, or expired records.",
      escalationNotice:
        "Escalate when a high-priority control has no evidence before an audit, customer review, or management report.",
      referencedScore: `Evidence Coverage: ${overview.domainScores.find((item) => item.key === "evidence_coverage")?.score ?? 0}%`,
    };
  }

  if (mode === "Incident") {
    return {
      mode,
      explanation: `Incident readiness is ${overview.domainScores.find((item) => item.key === "incident_readiness")?.score ?? 0}%. ${overview.incidentRollup.unresolved} incidents are still unresolved.`,
      identifiedRisk:
        "Slow containment or poor documentation can extend business disruption and reduce legal or audit defensibility.",
      recommendedActions: [
        "Record scope, timeline, and evidence immediately.",
        "Link the incident to the response policy and related controls.",
        "Close the action plan task only after documenting resolution notes.",
      ],
      priority: overview.incidentRollup.unresolved > 0 ? "High" : "Moderate",
      evidenceToKeep: ["incident timeline", "screenshots", "provider ticket reference", "closure note"],
      nextStep: "Open the incidents module and update any open or monitoring cases.",
      escalationNotice:
        "Escalate immediately for ransomware, data leakage, confirmed account compromise, or regulated personal-data exposure.",
      referencedScore: `Incident Readiness: ${overview.domainScores.find((item) => item.key === "incident_readiness")?.score ?? 0}%`,
    };
  }

  if (mode === "Report") {
    return {
      mode,
      explanation: `The current production-ready report is ${report.title}. It uses live dashboard scores, top risks, evidence coverage, and prioritized actions.`,
      identifiedRisk:
        "Reports become misleading when scores are stale or not backed by current linked records.",
      recommendedActions: [
        "Regenerate actions before creating the report.",
        "Review top risks and missing evidence slots.",
        "Confirm policy status and vendor gaps before exporting.",
      ],
      priority: overview.score.status,
      evidenceToKeep: ["generated readiness summary PDF", "risk register preview", "action plan preview"],
      nextStep: "Open Reports and generate the Compliance Readiness Summary PDF from current data.",
      escalationNotice:
        "Escalate if the report is being used for a contractual, legal, or regulatory submission and critical gaps remain unresolved.",
      referencedScore: `Overall FC237 Score: ${overview.score.overall}%`,
    };
  }

  if (mode === "Policy") {
    const draftOrExpired = overview.policyRollup.draftOrExpired;
    return {
      mode,
      explanation: `Policy maturity is ${overview.domainScores.find((item) => item.key === "policy_maturity")?.score ?? 0}%. ${draftOrExpired} policies are draft or expired.`,
      identifiedRisk:
        "Outdated or missing baseline policies weaken approval workflows, evidence collection, and incident discipline.",
      recommendedActions: [
        "Create any missing priority policy types first.",
        "Advance draft policies to in review or approved.",
        "Link policies to controls and supporting evidence.",
      ],
      priority: draftOrExpired > 0 ? "High" : "Moderate",
      evidenceToKeep: ["policy approval note", "review date", "linked evidence references"],
      nextStep: "Open the policy center and focus on draft, missing, or expired items.",
      escalationNotice:
        "Escalate if a required policy is missing while customer data, AI systems, or unresolved incidents are in scope.",
      referencedScore: `Policy Maturity: ${overview.domainScores.find((item) => item.key === "policy_maturity")?.score ?? 0}%`,
    };
  }

  if (mode === "Recommendation") {
    const vendorWeak = overview.vendorRollup.weak;
    const riskMessage =
      promptText.includes("vendor") || vendorWeak > 0
        ? `${vendorWeak} vendor reviews are currently weak or incomplete.`
        : `${overview.riskRollup.highOrCritical} high or critical risks need treatment.`;
    return {
      mode,
      explanation: `The platform recommends starting with the lowest domain, ${lowest.label}, then closing the highest-risk action items.`,
      identifiedRisk: riskMessage,
      recommendedActions: overview.nextActions.slice(0, 4).map((task) => task.title),
      priority: lowest.status,
      evidenceToKeep: ["action plan updates", "linked control evidence", "vendor review pack"],
      nextStep: firstAction ? `Go to the action plan and progress "${firstAction.title}".` : "Generate the action plan from current data.",
      escalationNotice:
        "Escalate if a critical risk has no owner, no due date, or no linked control/evidence path.",
      referencedScore: `${lowest.label}: ${lowest.score}%`,
    };
  }

  return {
    mode,
    explanation: `Overall FC237 posture is ${overview.score.status.toLowerCase()} at ${overview.score.overall}%. ${overview.assistantInsight.summary}`,
    identifiedRisk: topRisk?.title ?? "The main risk is losing sight of the next highest-value action.",
    recommendedActions: overview.assistantInsight.recommendedActions,
    priority: overview.score.status,
    evidenceToKeep: ["dashboard snapshot", "risk register", "action plan summary"],
    nextStep: firstAction ? `Start with "${firstAction.title}".` : "Open the dashboard and refresh the readiness workflow.",
    escalationNotice:
      "Escalate when a critical risk, missing incident capability, or unapproved customer-facing AI workflow remains open.",
    referencedScore: `Overall FC237 Score: ${overview.score.overall}%`,
  };
}

export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("chatSessions")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const listMessages = query({
  args: { sessionId: v.optional(v.id("chatSessions")) },
  handler: async (ctx, args) => {
    if (!args.sessionId) return [];
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.organizationId !== active.organization._id) return [];
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId as never))
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    content: v.string(),
    sessionId: v.optional(v.id("chatSessions")),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) throw new Error("Organization setup required");
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const overview = buildOverview(snapshot);
    const report = buildComplianceReport(snapshot);
    const timestamp = now();
    const sessionId =
      args.sessionId ??
      (await ctx.db.insert("chatSessions", {
        organizationId: active.organization._id,
        userId: active.user._id,
        title: args.content.slice(0, 60) || "FC237 Assistant",
        createdAt: timestamp,
        updatedAt: timestamp,
      }));

    const mode = detectMode(args.content);
    const response = buildResponse(mode, overview, args.content);
    const assistantText =
      mode === "Report"
        ? `${response.explanation} ${report.summary}`
        : response.explanation;

    await ctx.db.insert("chatMessages", {
      sessionId,
      senderType: "user",
      content: args.content,
      detectedIntent: mode,
      timestamp,
    });
    await ctx.db.insert("chatMessages", {
      sessionId,
      senderType: "assistant",
      content: assistantText,
      detectedIntent: mode,
      structuredResponse: response,
      timestamp: timestamp + 1,
    });
    await ctx.db.patch(sessionId, { updatedAt: timestamp });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "assistant.message_sent",
      entityType: "chatSession",
      entityId: sessionId,
      metadata: { intent: mode },
    });
    return { sessionId, response };
  },
});
