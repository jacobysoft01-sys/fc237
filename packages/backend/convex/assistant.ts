import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getActiveOrganization, logAuditEvent, now } from "./_shared";

function detectIntent(content: string) {
  const text = content.toLowerCase();
  if (
    text.includes("google drive") &&
    (text.includes("invoice") || text.includes("customer document") || text.includes("customer documents"))
  ) {
    return "google drive confidential documents";
  }
  if (text.includes("mfa") || text.includes("multi-factor")) return "mfa guidance";
  if (text.includes("backup")) return "backup guidance";
  if (text.includes("vendor") || text.includes("provider")) return "vendor evaluation";
  if (text.includes("incident") || text.includes("breach") || text.includes("suspicious")) return "incident response";
  if (text.includes("evidence") || text.includes("record")) return "compliance evidence";
  if (text.includes("maturity")) return "maturity assessment";
  if (text.includes("ai") || text.includes("model")) return "ai system inventory";
  if (text.includes("risk")) return "risk scoring";
  return "cloud readiness";
}

type AssistantResponse = {
  intent: string;
  explanation: string;
  identifiedRisk: string;
  recommendedActions: string[];
  priority: string;
  evidenceToKeep: string[];
  nextStep: string;
  escalationNotice: string;
  screenshotUseCase?: boolean;
};

function buildResponse(intent: string) {
  const common = {
    priority: "high priority",
    escalationNotice:
      "Escalate to a cybersecurity expert, legal professional, or provider if personal data, payment fraud, ransomware, or confirmed account compromise is involved.",
  };

  const responses: Record<string, Omit<AssistantResponse, "intent">> = {
    "google drive confidential documents": {
      priority: "high priority",
      explanation:
        "Based on FC237, this involves confidential and possibly personal data. You should enable multi-factor authentication, review folder-sharing permissions, remove former employees, avoid public links for sensitive documents, classify invoices and customer documents as confidential, keep a separate backup, and record the access review as compliance evidence.",
      identifiedRisk: "Confidential and possibly personal data stored in Google Drive may be exposed through weak account security, public sharing links, former employee access, or missing backups.",
      recommendedActions: [
        "Enable multi-factor authentication",
        "Review folder-sharing permissions",
        "Remove former employees",
        "Avoid public links for sensitive documents",
        "Classify invoices and customer documents as confidential",
        "Keep a separate backup",
        "Record the access review as compliance evidence",
      ],
      evidenceToKeep: ["access review record", "MFA screenshot", "folder-sharing export", "backup log"],
      nextStep: "Open Evidence Vault and record the Google Drive access review.",
      escalationNotice:
        "Escalate to a cybersecurity expert, legal professional, or provider if personal data exposure, confirmed account compromise, or a customer data breach is suspected.",
      screenshotUseCase: true,
    },
    "mfa guidance": {
      ...common,
      explanation: "MFA is one of the fastest ways to reduce cloud account takeover risk.",
      identifiedRisk: "A stolen password can give an attacker access to email, files, AI tools, and administrator consoles.",
      recommendedActions: ["Enable MFA for all users", "Require stronger MFA for admins", "Export or screenshot MFA status monthly"],
      evidenceToKeep: ["MFA policy", "admin screenshot", "monthly access review"],
      nextStep: "Open Controls and update the MFA control to in progress or implemented.",
    },
    "backup guidance": {
      ...common,
      explanation: "Backups help recover from accidental deletion, ransomware, and provider outages.",
      identifiedRisk: "Business data may be unrecoverable if cloud sync is mistaken for backup.",
      recommendedActions: ["Identify critical cloud data", "Schedule backups", "Test restoration", "Document backup owners"],
      evidenceToKeep: ["backup log", "restore test note", "backup policy"],
      nextStep: "Record backup evidence in the Evidence Vault.",
    },
    "vendor evaluation": {
      ...common,
      explanation: "Vendor evaluation checks whether a provider is safe enough for SME data and operations.",
      identifiedRisk: "A weak provider can create data location, availability, deletion, export, and support risk.",
      recommendedActions: ["Score MFA, encryption, backup, data location, support, contracts, and compliance documents"],
      evidenceToKeep: ["contract", "SLA", "data-processing terms", "security documentation"],
      nextStep: "Open Vendor Evaluation and score the provider.",
    },
    "incident response": {
      ...common,
      explanation: "Incident response should prioritize containment, preservation, and escalation.",
      identifiedRisk: "Delayed action can increase data loss, account compromise, or legal exposure.",
      recommendedActions: ["Record the incident time", "Preserve screenshots", "Revoke suspicious sessions", "Contact the provider"],
      evidenceToKeep: ["incident log", "screenshots", "provider case number", "response timeline"],
      nextStep: "Open Incidents and create a response record.",
    },
    "compliance evidence": {
      ...common,
      explanation: "Evidence proves controls were implemented and helps prepare for audit or management review.",
      identifiedRisk: "Implemented controls may be unverifiable without screenshots, logs, policies, or registers.",
      recommendedActions: ["Link evidence to controls", "Review rejected or expired evidence", "Keep report copies"],
      evidenceToKeep: ["MFA screenshots", "access reviews", "risk register", "generated reports"],
      nextStep: "Open Evidence Vault and add evidence for the highest-priority controls.",
    },
    "ai system inventory": {
      ...common,
      explanation: "An AI register shows which AI systems exist, who owns them, and what data they process.",
      identifiedRisk: "Unregistered AI tools can process confidential or personal data without governance.",
      recommendedActions: ["Register each AI system", "Assign an owner", "Record vendor and model/service", "Set a risk level"],
      evidenceToKeep: ["AI register", "AI usage policy", "vendor review"],
      nextStep: "Open AI System Inventory and add each AI tool currently in use.",
    },
    "risk scoring": {
      ...common,
      explanation: "FC237 scores risk by multiplying likelihood by impact.",
      identifiedRisk: "Unscored risks are hard to prioritize and may leave critical gaps untreated.",
      recommendedActions: ["Score likelihood from 1 to 5", "Score impact from 1 to 5", "Prioritize high and critical risks"],
      evidenceToKeep: ["risk register", "treatment plan", "review notes"],
      nextStep: "Open Risk Management and create or update a risk.",
    },
    "cloud readiness": {
      ...common,
      explanation: "Cloud readiness measures whether cloud services are inventoried, protected, backed up, and reviewed.",
      identifiedRisk: "Weak inventory and missing controls make cloud adoption difficult to govern.",
      recommendedActions: ["Complete readiness assessment", "Classify data", "Review MFA, backups, vendors, and incidents"],
      evidenceToKeep: ["assessment summary", "cloud inventory", "control checklist"],
      nextStep: "Run the Cloud Readiness assessment.",
    },
    "maturity assessment": {
      ...common,
      explanation: "Maturity shows how consistently governance, controls, compliance, vendors, and incidents are managed.",
      identifiedRisk: "A low maturity level means controls may exist informally but are not repeatable.",
      recommendedActions: ["Assess each maturity domain", "Identify weakest domain", "Create next-level improvement tasks"],
      evidenceToKeep: ["maturity assessment", "improvement plan", "policy review"],
      nextStep: "Open Governance Maturity and complete the assessment.",
    },
  };

  return { intent, ...(responses[intent] ?? responses["cloud readiness"]) };
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

    const intent = detectIntent(args.content);
    const response = buildResponse(intent);

    await ctx.db.insert("chatMessages", {
      sessionId,
      senderType: "user",
      content: args.content,
      detectedIntent: intent,
      timestamp,
    });
    await ctx.db.insert("chatMessages", {
      sessionId,
      senderType: "assistant",
      content: response.explanation,
      detectedIntent: intent,
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
      metadata: { intent },
    });
    return { sessionId, response };
  },
});
