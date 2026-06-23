import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type ReadCtx = QueryCtx | MutationCtx;

export function now() {
  return Date.now();
}

export function calculateRiskScore(likelihood: number, impact: number) {
  return likelihood * impact;
}

export function classifyRisk(score: number) {
  if (score >= 16) return "critical";
  if (score >= 11) return "high";
  if (score >= 6) return "moderate";
  return "low";
}

export function classifyReadiness(score: number) {
  if (score >= 85) return "Cloud-ready";
  if (score >= 65) return "Ready with improvements";
  if (score >= 40) return "Partially ready";
  return "Not ready";
}

export function classifyVendor(score: number) {
  if (score >= 85) return "strong provider fit";
  if (score >= 65) return "good provider fit";
  if (score >= 40) return "moderate provider fit";
  return "weak provider fit";
}

export function maturityLabel(level: number) {
  if (level >= 5) return "Optimized";
  if (level >= 4) return "Managed";
  if (level >= 3) return "Defined";
  if (level >= 2) return "Basic";
  return "Ad hoc";
}

export async function getCurrentIdentity(ctx: ReadCtx) {
  return await ctx.auth.getUserIdentity();
}

export async function getCurrentUser(ctx: ReadCtx) {
  const identity = await getCurrentIdentity(ctx);
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  return user ? { identity, user } : null;
}

export async function requireUser(ctx: ReadCtx) {
  const current = await getCurrentUser(ctx);
  if (!current) {
    throw new Error("Authentication required");
  }
  return current;
}

export async function ensureUser(ctx: MutationCtx) {
  const identity = await getCurrentIdentity(ctx);
  if (!identity) {
    throw new Error("Authentication required");
  }

  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  const timestamp = now();
  if (existing) {
    await ctx.db.patch(existing._id, {
      email: identity.email,
      fullName: identity.name,
      updatedAt: timestamp,
    });
    return { identity, user: existing };
  }

  const userId = await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    email: identity.email,
    fullName: identity.name,
    role: "member",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Unable to create user");
  return { identity, user };
}

export async function getActiveOrganization(ctx: ReadCtx) {
  const current = await getCurrentUser(ctx);
  if (!current) return null;

  if (current.user.activeOrganizationId) {
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_user", (q) =>
        q.eq("organizationId", current.user.activeOrganizationId as Id<"organizations">).eq("userId", current.user._id),
      )
      .unique();
    const organization = await ctx.db.get(current.user.activeOrganizationId);
    if (organization && membership?.status === "active") {
      return { ...current, organization, membership };
    }
  }

  const membership = await ctx.db
    .query("organizationMembers")
    .withIndex("by_user", (q) => q.eq("userId", current.user._id))
    .first();
  if (!membership || membership.status !== "active") return { ...current, organization: null, membership: null };

  const organization = await ctx.db.get(membership.organizationId);
  if (!organization) return { ...current, organization: null, membership: null };

  return { ...current, organization, membership };
}

export async function requireActiveOrganization(ctx: ReadCtx) {
  const active = await getActiveOrganization(ctx);
  if (!active?.organization || !active.membership) {
    throw new Error("Organization setup required");
  }
  return active;
}

export function assertRole(role: string, allowed: string[]) {
  if (!allowed.includes(role)) {
    throw new Error("You do not have permission to perform this action");
  }
}

export async function logAuditEvent(
  ctx: MutationCtx,
  input: {
    organizationId: Id<"organizations">;
    userId?: Id<"users">;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: unknown;
  },
) {
  await ctx.db.insert("auditLogs", {
    organizationId: input.organizationId,
    userId: input.userId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
    createdAt: now(),
  });
}

const defaultControls = [
  {
    controlKey: "FC237-GOV-01",
    name: "Assign cloud and AI governance owners",
    description: "Name accountable owners for cloud services, AI systems, risks, and evidence.",
    pillar: "governance",
    priority: "high priority",
    implementationStatus: "implemented",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "ISO/IEC 27001", "NIST AI RMF"],
  },
  {
    controlKey: "FC237-TEC-01",
    name: "Enable multi-factor authentication",
    description: "Require MFA for email, cloud storage, administrator accounts, and sensitive AI tools.",
    pillar: "technical controls",
    priority: "urgent",
    implementationStatus: "in progress",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
  },
  {
    controlKey: "FC237-COM-01",
    name: "Maintain an Evidence Vault",
    description: "Keep screenshots, reviews, logs, policies, reports, and vendor documents tied to controls.",
    pillar: "compliance",
    priority: "high priority",
    implementationStatus: "in progress",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "ISO/IEC 27001", "EU AI Act"],
  },
  {
    controlKey: "FC237-GOV-02",
    name: "Review cloud and AI vendors",
    description: "Evaluate providers for MFA, encryption, backup, data location, contracts, export, and support.",
    pillar: "governance",
    priority: "medium priority",
    implementationStatus: "not_started",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "NIST AI RMF"],
  },
  {
    controlKey: "FC237-TEC-02",
    name: "Configure backups and recovery",
    description: "Document backup scope, frequency, restoration owners, and recovery tests.",
    pillar: "technical controls",
    priority: "high priority",
    implementationStatus: "implemented",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
  },
  {
    controlKey: "FC237-COM-02",
    name: "Classify sensitive and personal data",
    description: "Identify public, internal, confidential, personal, and critical data used in cloud or AI systems.",
    pillar: "compliance",
    priority: "high priority",
    implementationStatus: "in progress",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "EU AI Act"],
  },
  {
    controlKey: "FC237-TEC-03",
    name: "Centralize logging and access review",
    description: "Review account access and keep logs for suspicious sign-ins, sharing, and administrator actions.",
    pillar: "technical controls",
    priority: "medium priority",
    implementationStatus: "not_started",
    evidenceRequired: true,
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
  },
];

export async function seedOrganizationDefaults(
  ctx: MutationCtx,
  organizationId: Id<"organizations">,
  user: Doc<"users">,
) {
  const timestamp = now();

  await Promise.all(
    defaultControls.map((control) =>
      ctx.db.insert("controls", {
        organizationId,
        ...control,
        createdAt: timestamp,
      }),
    ),
  );

  await Promise.all([
    ctx.db.insert("cloudServices", {
      organizationId,
      serviceName: "Microsoft 365",
      providerName: "Microsoft",
      serviceModel: "SaaS",
      purpose: "Email, collaboration, document storage",
      dataStored: "Confidential and personal data",
      approved: true,
      owner: user.fullName ?? "Risk owner",
      createdAt: timestamp,
    }),
    ctx.db.insert("cloudServices", {
      organizationId,
      serviceName: "AWS Lightsail",
      providerName: "Amazon Web Services",
      serviceModel: "IaaS",
      purpose: "Website hosting",
      dataStored: "Public web content and logs",
      approved: true,
      owner: "ICT support",
      createdAt: timestamp,
    }),
    ctx.db.insert("cloudServices", {
      organizationId,
      serviceName: "Google Drive",
      providerName: "Google",
      serviceModel: "SaaS",
      purpose: "Team file sharing",
      dataStored: "Internal business documents",
      approved: false,
      owner: "Operations",
      createdAt: timestamp,
    }),
  ]);

  await Promise.all([
    ctx.db.insert("aiSystems", {
      organizationId,
      name: "Customer Support Copilot",
      owner: "Operations",
      vendor: "OpenAI",
      modelOrService: "Hosted LLM assistant",
      purpose: "Draft customer replies and summarize support cases",
      dataSensitivity: "internal",
      riskLevel: "moderate",
      status: "active",
      createdAt: timestamp,
    }),
    ctx.db.insert("aiSystems", {
      organizationId,
      name: "Finance Forecast Assistant",
      owner: "Finance",
      vendor: "Microsoft",
      modelOrService: "Copilot for spreadsheets",
      purpose: "Summarize and forecast cash flow",
      dataSensitivity: "confidential",
      riskLevel: "high",
      status: "review_needed",
      createdAt: timestamp,
    }),
  ]);

  const seededRisks = [
    ["Account compromise", "technical", 4, 4, "ICT support", "MFA rollout in progress"],
    ["Data leakage from public sharing", "human_operational", 4, 3, "Operations", "Sharing policy draft"],
    ["Insecure cloud configurations", "technical", 3, 3, "ICT support", "Review pending"],
    ["Insufficient logging", "governance", 3, 3, "Compliance officer", "Not started"],
    ["Unreviewed AI vendor data terms", "ai", 3, 4, "Risk owner", "Vendor review planned"],
  ] as const;

  await Promise.all(
    seededRisks.map(([title, category, likelihood, impact, owner, remediationStatus]) => {
      const riskScore = calculateRiskScore(likelihood, impact);
      return ctx.db.insert("risks", {
        organizationId,
        title,
        category,
        likelihood,
        impact,
        riskScore,
        riskLevel: classifyRisk(riskScore),
        owner,
        treatmentStatus: "mitigate",
        remediationStatus,
        createdAt: timestamp,
      });
    }),
  );

  await Promise.all([
    ctx.db.insert("recommendations", {
      organizationId,
      sourceType: "assessment",
      title: "Complete MFA rollout for all privileged accounts",
      plainLanguageExplanation: "MFA reduces the chance that a stolen password becomes a full account takeover.",
      priority: "urgent",
      pillar: "technical controls",
      evidenceRequired: "MFA screenshots or admin export",
      status: "open",
      createdAt: timestamp,
    }),
    ctx.db.insert("recommendations", {
      organizationId,
      sourceType: "ai_risk",
      title: "Register every AI system and assign an owner",
      plainLanguageExplanation: "An AI register helps leadership know which tools process business data and who is accountable.",
      priority: "high priority",
      pillar: "governance",
      evidenceRequired: "AI system register export",
      status: "open",
      createdAt: timestamp,
    }),
  ]);

  await Promise.all([
    ctx.db.insert("tasks", {
      organizationId,
      title: "Review and update access controls",
      priority: "high",
      status: "open",
      dueDate: "2026-06-24",
      sourceType: "control",
      createdAt: timestamp,
    }),
    ctx.db.insert("tasks", {
      organizationId,
      title: "Complete data classification review",
      priority: "medium",
      status: "open",
      dueDate: "2026-06-28",
      sourceType: "data",
      createdAt: timestamp,
    }),
    ctx.db.insert("tasks", {
      organizationId,
      title: "Run incident response drill",
      priority: "low",
      status: "open",
      dueDate: "2026-07-02",
      sourceType: "incident",
      createdAt: timestamp,
    }),
    ctx.db.insert("tasks", {
      organizationId,
      title: "Reassess AWS vendor documentation",
      priority: "medium",
      status: "open",
      dueDate: "2026-07-10",
      sourceType: "vendor",
      createdAt: timestamp,
    }),
  ]);

  await Promise.all([
    ctx.db.insert("policies", {
      organizationId,
      title: "AI Usage Policy",
      type: "ai_usage",
      status: "draft",
      owner: "Cyber focal point",
      reviewDate: "2026-07-15",
      createdAt: timestamp,
    }),
    ctx.db.insert("policies", {
      organizationId,
      title: "Data Governance Policy",
      type: "data_governance",
      status: "in_review",
      owner: "Compliance officer",
      reviewDate: "2026-07-20",
      createdAt: timestamp,
    }),
    ctx.db.insert("policies", {
      organizationId,
      title: "Vendor Policy",
      type: "vendor",
      status: "approved",
      owner: "Risk owner",
      reviewDate: "2026-09-01",
      createdAt: timestamp,
    }),
  ]);
}

