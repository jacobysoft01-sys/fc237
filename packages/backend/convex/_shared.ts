import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";

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
    description: "Name accountable owners for cloud services, AI systems, risks, evidence, and policy reviews.",
    pillar: "governance",
    domain: "Command Center",
    priority: "high priority",
    implementationStatus: "implemented",
    evidenceRequired: true,
    requiredEvidenceDescription: "Organization chart, role assignment note, or governance ownership approval.",
    implementationGuidance: "Assign business, technical, and compliance contacts before scaling assessments.",
    frameworkMappings: ["FC237", "ISO/IEC 27001", "NIST AI RMF"],
    frameworkMappingDetails: [
      { framework: "FC237", reference: "Governance Ownership", note: "Foundational accountability requirement." },
      { framework: "ISO/IEC 27001", reference: "5.3", note: "Organizational roles and responsibilities." },
    ],
  },
  {
    controlKey: "FC237-TEC-01",
    name: "Enable multi-factor authentication",
    description: "Require MFA for email, storage, cloud admins, and sensitive AI tools.",
    pillar: "technical controls",
    domain: "Cloud Readiness",
    priority: "urgent",
    implementationStatus: "in_progress",
    evidenceRequired: true,
    requiredEvidenceDescription: "Administrative screenshot, policy note, or export confirming MFA enforcement.",
    implementationGuidance: "Cover privileged users first, then expand to customer-data and finance workflows.",
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
    frameworkMappingDetails: [
      { framework: "FC237", reference: "Identity Protection", note: "Core cloud account safeguard." },
    ],
  },
  {
    controlKey: "FC237-COM-01",
    name: "Maintain an Evidence Vault",
    description: "Keep screenshots, reviews, logs, policies, reports, and vendor documents tied to controls.",
    pillar: "compliance",
    domain: "Evidence Coverage",
    priority: "high priority",
    implementationStatus: "in_progress",
    evidenceRequired: true,
    requiredEvidenceDescription: "Evidence index with linked files and review comments.",
    implementationGuidance: "Store evidence by control and mark reviewers to prevent audit scramble.",
    frameworkMappings: ["FC237", "ISO/IEC 27001", "EU AI Act"],
    frameworkMappingDetails: [
      { framework: "FC237", reference: "Evidence Discipline", note: "Proof of implementation." },
    ],
  },
  {
    controlKey: "FC237-GOV-02",
    name: "Review cloud and AI vendors",
    description: "Evaluate providers for MFA, encryption, backup, data location, contracts, export, and support.",
    pillar: "governance",
    domain: "Vendor Readiness",
    priority: "high priority",
    implementationStatus: "in_progress",
    evidenceRequired: true,
    requiredEvidenceDescription: "Vendor evaluation form, contract notes, and documentation gap register.",
    implementationGuidance: "Link vendors to AI systems and cloud services before approval.",
    frameworkMappings: ["FC237", "NIST AI RMF"],
    frameworkMappingDetails: [
      { framework: "NIST AI RMF", reference: "Govern", note: "Third-party AI oversight." },
    ],
  },
  {
    controlKey: "FC237-TEC-02",
    name: "Configure backups and recovery",
    description: "Document backup scope, frequency, restoration owners, and recovery tests.",
    pillar: "technical controls",
    domain: "Cloud Readiness",
    priority: "high priority",
    implementationStatus: "implemented",
    evidenceRequired: true,
    requiredEvidenceDescription: "Backup policy, job output, and restore test note.",
    implementationGuidance: "Prioritize customer records, finance data, and critical operational systems.",
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
    frameworkMappingDetails: [
      { framework: "ISO/IEC 27001", reference: "8.13", note: "Information backup." },
    ],
  },
  {
    controlKey: "FC237-COM-02",
    name: "Classify sensitive and personal data",
    description: "Identify public, internal, confidential, personal, and critical data used in cloud or AI systems.",
    pillar: "compliance",
    domain: "AI Governance",
    priority: "high priority",
    implementationStatus: "in_progress",
    evidenceRequired: true,
    requiredEvidenceDescription: "Data inventory, classification sheet, or data handling standard.",
    implementationGuidance: "Link classifications to AI systems that process customer or employee information.",
    frameworkMappings: ["FC237", "EU AI Act"],
    frameworkMappingDetails: [
      { framework: "EU AI Act", reference: "Data Governance", note: "Data handling and oversight." },
    ],
  },
  {
    controlKey: "FC237-TEC-03",
    name: "Centralize logging and access review",
    description: "Review account access and keep logs for suspicious sign-ins, sharing, and admin actions.",
    pillar: "technical controls",
    domain: "Cloud Readiness",
    priority: "medium priority",
    implementationStatus: "not_started",
    evidenceRequired: true,
    requiredEvidenceDescription: "Access review notes, exported log sample, and follow-up actions.",
    implementationGuidance: "Run a lightweight monthly review for privileged and departed-user access.",
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
    frameworkMappingDetails: [
      { framework: "ISO/IEC 27001", reference: "8.16", note: "Monitoring activities." },
    ],
  },
  {
    controlKey: "FC237-IR-01",
    name: "Maintain an incident response procedure",
    description: "Document detection, containment, escalation, evidence preservation, and closure steps.",
    pillar: "governance",
    domain: "Incident Readiness",
    priority: "high priority",
    implementationStatus: "not_started",
    evidenceRequired: true,
    requiredEvidenceDescription: "Incident procedure, drill note, or response timeline example.",
    implementationGuidance: "Keep first-response actions simple and review them after every incident or drill.",
    frameworkMappings: ["FC237", "ISO/IEC 27001"],
    frameworkMappingDetails: [
      { framework: "ISO/IEC 27001", reference: "5.24", note: "Information security incident management planning." },
    ],
  },
];

export async function seedOrganizationDefaults(
  ctx: MutationCtx,
  organizationId: Id<"organizations">,
  user: Doc<"users">,
) {
  const timestamp = now();
  const userName = user.fullName ?? "Risk owner";

  const controlIds = await Promise.all(
    defaultControls.map((control, index) =>
      ctx.db.insert("controls", {
        organizationId,
        owner: index < 3 ? userName : undefined,
        dueDate: new Date(timestamp + (index + 5) * 86400000).toISOString().slice(0, 10),
        createdAt: timestamp,
        ...control,
      }),
    ),
  );

  const [microsoft365Id, awsId, googleDriveId] = await Promise.all([
    ctx.db.insert("cloudServices", {
      organizationId,
      serviceName: "Microsoft 365",
      providerName: "Microsoft",
      serviceModel: "SaaS",
      purpose: "Email, collaboration, document storage",
      dataStored: "Confidential and personal data",
      approved: true,
      owner: userName,
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

  const [supportAiId, financeAiId] = await Promise.all([
    ctx.db.insert("aiSystems", {
      organizationId,
      name: "Customer Support Copilot",
      owner: "Operations",
      businessOwner: "Operations",
      technicalOwner: userName,
      department: "Customer Experience",
      vendor: "OpenAI",
      modelOrService: "Hosted LLM assistant",
      purpose: "Draft customer replies and summarize support cases",
      usePurpose: "Assist support responses with human approval before sending.",
      dataSensitivity: "personal",
      internalExternalFlag: "external",
      personalDataFlags: ["customer_contact_data"],
      sensitiveDataFlag: true,
      customerFacingFlag: true,
      automatedDecisionFlag: false,
      humanReviewFlag: true,
      businessCriticality: "high",
      approvalStatus: "conditional",
      riskLevel: "high",
      status: "review_needed",
      reviewDate: "2026-07-30",
      relatedControlIds: [controlIds[0], controlIds[5]],
      notes: "Vendor review pending on data handling and customer data boundaries.",
      createdAt: timestamp,
    }),
    ctx.db.insert("aiSystems", {
      organizationId,
      name: "Finance Forecast Assistant",
      owner: "Finance",
      businessOwner: "Finance",
      technicalOwner: userName,
      department: "Finance",
      vendor: "Microsoft",
      modelOrService: "Copilot for spreadsheets",
      purpose: "Summarize and forecast cash flow",
      usePurpose: "Speed up internal forecasting and reporting.",
      dataSensitivity: "confidential",
      internalExternalFlag: "internal",
      personalDataFlags: [],
      sensitiveDataFlag: false,
      customerFacingFlag: false,
      automatedDecisionFlag: false,
      humanReviewFlag: true,
      businessCriticality: "medium",
      approvalStatus: "approved",
      riskLevel: "moderate",
      status: "active",
      reviewDate: "2026-08-15",
      relatedControlIds: [controlIds[0], controlIds[1]],
      notes: "Approved for internal-only usage.",
      createdAt: timestamp,
    }),
  ]);

  await Promise.all([
    ctx.db.insert("dataAssets", {
      organizationId,
      name: "Customer Support Records",
      classification: "personal",
      cloudServiceId: microsoft365Id,
      aiSystemId: supportAiId,
      retentionGuidance: "Retain according to customer service record policy and backup weekly.",
      createdAt: timestamp,
    }),
    ctx.db.insert("dataAssets", {
      organizationId,
      name: "Financial Planning Workbook",
      classification: "confidential",
      cloudServiceId: googleDriveId,
      aiSystemId: financeAiId,
      retentionGuidance: "Restrict access to finance and leadership only.",
      createdAt: timestamp,
    }),
  ]);

  const vendorIds = await Promise.all([
    ctx.db.insert("vendorEvaluations", {
      organizationId,
      vendorName: "OpenAI",
      serviceName: "Customer Support Copilot",
      criteriaScores: {
        mfa: 4,
        encryption: 4,
        backup: 3,
        dataLocation: 2,
        support: 3,
        contractClarity: 2,
        complianceDocs: 2,
      },
      score: 57,
      classification: classifyVendor(57),
      evidenceNotes: "Need clearer vendor review notes for customer data boundaries.",
      identity: {
        vendorCategory: "AI service provider",
        website: "https://openai.com",
        relationshipOwner: "Operations",
        headquarters: "United States",
        dataHostingLocation: "Multi-region",
      },
      security: {
        mfa: 4,
        encryption: 4,
        backup: 3,
        accessControl: 3,
        logging: 3,
        incidentSupport: 3,
      },
      compliance: {
        dataProcessingAgreement: false,
        subprocessorsDisclosed: true,
        privacyNoticeReviewed: true,
        certifications: ["SOC 2"],
        complianceDocsScore: 2,
      },
      evidenceSection: {
        documentsReceived: ["Terms of use", "Privacy notice"],
        outstandingGaps: ["Data processing agreement", "Retention clarification"],
        lastReviewedAt: "2026-06-10",
      },
      relatedAiSystemIds: [supportAiId],
      createdAt: timestamp,
    }),
    ctx.db.insert("vendorEvaluations", {
      organizationId,
      vendorName: "Microsoft",
      serviceName: "Microsoft 365",
      criteriaScores: {
        mfa: 5,
        encryption: 4,
        backup: 4,
        dataLocation: 4,
        support: 4,
        contractClarity: 4,
        complianceDocs: 4,
      },
      score: 83,
      classification: classifyVendor(83),
      evidenceNotes: "Strong provider fit with standard review cadence.",
      identity: {
        vendorCategory: "Cloud productivity suite",
        website: "https://microsoft.com",
        relationshipOwner: userName,
        headquarters: "United States",
        dataHostingLocation: "Regional tenant",
      },
      security: {
        mfa: 5,
        encryption: 4,
        backup: 4,
        accessControl: 4,
        logging: 4,
        incidentSupport: 4,
      },
      compliance: {
        dataProcessingAgreement: true,
        subprocessorsDisclosed: true,
        privacyNoticeReviewed: true,
        certifications: ["ISO 27001", "SOC 2"],
        complianceDocsScore: 4,
      },
      evidenceSection: {
        documentsReceived: ["DPA", "Trust center export", "SLA"],
        outstandingGaps: [],
        lastReviewedAt: "2026-06-08",
      },
      relatedCloudServiceIds: [microsoft365Id],
      relatedAiSystemIds: [financeAiId],
      createdAt: timestamp,
    }),
  ]);

  await ctx.db.patch(supportAiId, {
    relatedVendorEvaluationId: vendorIds[0],
  });
  await ctx.db.patch(financeAiId, {
    relatedVendorEvaluationId: vendorIds[1],
  });

  const seededRisks = [
    {
      title: "Account compromise",
      category: "technical",
      likelihood: 4,
      impact: 4,
      owner: "ICT support",
      remediationStatus: "MFA rollout in progress",
      description: "A stolen password could expose email, shared files, and cloud administration interfaces.",
      rootCause: "Incomplete MFA coverage for privileged accounts.",
      dueDate: "2026-07-08",
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Admin MFA export and privileged access review evidence.",
      relatedControlIds: [controlIds[1], controlIds[6]],
      relatedCloudServiceId: microsoft365Id,
    },
    {
      title: "Data leakage from public sharing",
      category: "human_operational",
      likelihood: 4,
      impact: 3,
      owner: "Operations",
      remediationStatus: "Sharing policy draft",
      description: "Public links or stale access on shared drives may expose confidential customer and operations data.",
      rootCause: "Incomplete review of sharing permissions and departed-user access.",
      dueDate: "2026-07-04",
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Sharing review record and tightened access evidence.",
      relatedControlIds: [controlIds[6], controlIds[2]],
      relatedCloudServiceId: googleDriveId,
    },
    {
      title: "Insufficient incident preparation",
      category: "governance",
      likelihood: 3,
      impact: 4,
      owner: "Cyber focal point",
      remediationStatus: "Incident procedure not approved",
      description: "The team may react slowly to phishing or cloud account compromise without a clear response playbook.",
      rootCause: "Incident response procedure is still missing.",
      dueDate: "2026-07-12",
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Incident response policy and drill note.",
      relatedControlIds: [controlIds[7]],
    },
    {
      title: "Unreviewed AI vendor data terms",
      category: "ai",
      likelihood: 3,
      impact: 4,
      owner: "Risk owner",
      remediationStatus: "Vendor review planned",
      description: "Customer-facing AI usage may proceed without complete vendor documentation or approval guardrails.",
      rootCause: "Incomplete vendor assurance and approval workflow for AI systems.",
      dueDate: "2026-07-09",
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Vendor review pack, AI approval note, and AI usage policy.",
      relatedAiSystemId: supportAiId,
      relatedVendorEvaluationId: vendorIds[0],
      relatedControlIds: [controlIds[3], controlIds[5]],
    },
  ];

  const riskIds = await Promise.all(
    seededRisks.map((risk) => {
      const riskScore = calculateRiskScore(risk.likelihood, risk.impact);
      return ctx.db.insert("risks", {
        organizationId,
        riskScore,
        riskLevel: classifyRisk(riskScore),
        treatmentStatus: risk.treatmentOption,
        createdAt: timestamp,
        ...risk,
      });
    }),
  );

  await ctx.db.patch(supportAiId, {
    relatedEvidenceIds: [],
  });

  await Promise.all([
    ctx.db.insert("recommendations", {
      organizationId,
      sourceType: "assessment",
      title: "Close MFA and access review gaps",
      plainLanguageExplanation: "The readiness assessment shows identity and access gaps that raise cloud takeover and data leakage risk.",
      priority: "urgent",
      pillar: "technical controls",
      evidenceRequired: "MFA admin screenshot and access review note",
      status: "open",
      createdAt: timestamp,
    }),
    ctx.db.insert("recommendations", {
      organizationId,
      sourceType: "ai_risk",
      title: "Finish the AI approval and vendor review loop",
      plainLanguageExplanation: "AI systems with customer data need explicit approval, linked controls, and a vendor review trail.",
      priority: "high priority",
      pillar: "governance",
      evidenceRequired: "AI usage policy and vendor review pack",
      status: "open",
      createdAt: timestamp,
    }),
  ]);

  const [incidentPolicyId, dataPolicyId, vendorPolicyId, accessPolicyId, backupPolicyId] = await Promise.all([
    ctx.db.insert("policies", {
      organizationId,
      title: "Incident Response Policy",
      type: "incident_response",
      status: "draft",
      owner: "Cyber focal point",
      priority: "critical",
      summary: "Defines first response, escalation, and documentation steps for cyber incidents.",
      templateKey: "incident_response",
      reviewDate: "2026-07-14",
      expiryDate: "2026-07-14",
      relatedControlIds: [controlIds[7]],
      createdAt: timestamp,
    }),
    ctx.db.insert("policies", {
      organizationId,
      title: "Data Governance Policy",
      type: "data_governance",
      status: "in_review",
      owner: "Compliance officer",
      priority: "high",
      summary: "Covers data classification, retention, and handling for cloud and AI systems.",
      templateKey: "data_governance",
      reviewDate: "2026-07-20",
      expiryDate: "2026-07-20",
      relatedControlIds: [controlIds[5]],
      createdAt: timestamp,
    }),
    ctx.db.insert("policies", {
      organizationId,
      title: "Vendor Management Policy",
      type: "vendor_management",
      status: "approved",
      owner: "Risk owner",
      priority: "high",
      summary: "Sets vendor review, approval, reassessment, and documentation expectations.",
      templateKey: "vendor_management",
      reviewDate: "2026-09-01",
      expiryDate: "2026-09-01",
      approvedAt: "2026-05-01",
      relatedControlIds: [controlIds[3]],
      createdAt: timestamp,
    }),
    ctx.db.insert("policies", {
      organizationId,
      title: "Access Control Policy",
      type: "access_control",
      status: "approved",
      owner: userName,
      priority: "critical",
      summary: "Defines access provisioning, review, and removal expectations.",
      templateKey: "access_control",
      reviewDate: "2026-08-01",
      expiryDate: "2026-08-01",
      approvedAt: "2026-05-15",
      relatedControlIds: [controlIds[1], controlIds[6]],
      createdAt: timestamp,
    }),
    ctx.db.insert("policies", {
      organizationId,
      title: "Backup and Recovery Policy",
      type: "backup_recovery",
      status: "approved",
      owner: "ICT support",
      priority: "high",
      summary: "Documents backup scope, restore responsibilities, and test expectations.",
      templateKey: "backup_recovery",
      reviewDate: "2026-08-10",
      expiryDate: "2026-08-10",
      approvedAt: "2026-05-10",
      relatedControlIds: [controlIds[4]],
      createdAt: timestamp,
    }),
  ]);

  const evidenceIds = await Promise.all([
    ctx.db.insert("evidence", {
      organizationId,
      title: "MFA Admin Screenshot",
      evidenceType: "MFA screenshot",
      controlId: controlIds[1],
      status: "submitted",
      reviewNotes: "Need full privileged-user coverage screenshot.",
      submittedBy: userName,
      reviewer: "Cyber focal point",
      reviewDate: "2026-06-20",
      uploadedBy: user._id,
      uploadedAt: timestamp,
    }),
    ctx.db.insert("evidence", {
      organizationId,
      title: "Backup Restore Note",
      evidenceType: "Backup log",
      controlId: controlIds[4],
      status: "accepted",
      reviewNotes: "Recent restore test completed successfully.",
      submittedBy: "ICT support",
      reviewer: "Risk owner",
      reviewDate: "2026-06-11",
      uploadedBy: user._id,
      uploadedAt: timestamp,
    }),
    ctx.db.insert("evidence", {
      organizationId,
      title: "Vendor Review Pack - OpenAI",
      evidenceType: "Vendor evaluation form",
      controlId: controlIds[3],
      relatedVendorEvaluationId: vendorIds[0],
      relatedRiskId: riskIds[3],
      status: "pending",
      reviewNotes: "Awaiting missing DPA and retention clarification.",
      submittedBy: "Operations",
      reviewer: "Risk owner",
      expiryDate: "2026-07-15",
      uploadedBy: user._id,
      uploadedAt: timestamp,
    }),
  ]);

  await ctx.db.patch(supportAiId, {
    relatedEvidenceIds: [evidenceIds[2]],
  });

  await ctx.db.insert("incidents", {
    organizationId,
    title: "Suspicious M365 sign-in attempt",
    category: "suspicious login",
    severity: "medium",
    status: "monitoring",
    detectedAt: "2026-06-12",
    responseActions: [
      "Reset the affected account password",
      "Review MFA coverage for privileged users",
      "Capture sign-in details and close with timeline notes",
    ],
    escalationRecommended: false,
    owner: "ICT support",
    relatedPolicyId: incidentPolicyId,
    relatedControlIds: [controlIds[1], controlIds[7]],
    relatedEvidenceIds: [evidenceIds[0]],
    createdAt: timestamp,
  });

  const readinessAnswers = [
    { questionKey: "cloud_inventory", answer: "Most critical services are registered but ownership is incomplete.", score: 4, domain: "Cloud Readiness" },
    { questionKey: "mfa", answer: "MFA is active for admins but not yet universal.", score: 3, domain: "Cloud Readiness" },
    { questionKey: "backup", answer: "Backup scope is defined and a restore test exists.", score: 4, domain: "Cloud Readiness" },
    { questionKey: "access_review", answer: "Access review is informal and not consistently evidenced.", score: 2, domain: "Cloud Readiness" },
    { questionKey: "vendor_review", answer: "Core vendors are reviewed, but AI vendor gaps remain.", score: 2, domain: "Vendor Readiness" },
    { questionKey: "incident_readiness", answer: "Incident response actions exist, but policy approval is incomplete.", score: 2, domain: "Incident Readiness" },
    { questionKey: "evidence_maturity", answer: "Evidence is collected, but coverage is incomplete.", score: 3, domain: "Evidence Coverage" },
  ] as const;
  const readinessScore = Math.round((readinessAnswers.reduce((sum, answer) => sum + answer.score, 0) / (readinessAnswers.length * 5)) * 100);

  const assessmentId = await ctx.db.insert("assessments", {
    organizationId,
    type: "readiness",
    status: "submitted",
    score: readinessScore,
    classification: classifyReadiness(readinessScore),
    summary: "Seeded baseline readiness assessment for demo organizations.",
    startedAt: timestamp,
    submittedAt: timestamp,
  });

  await Promise.all(
    readinessAnswers.map((answer) =>
      ctx.db.insert("assessmentResponses", {
        assessmentId,
        createdAt: timestamp,
        ...answer,
      }),
    ),
  );

  await ctx.db.patch(organizationId, {
    readinessScore,
    maturityDomainScores: {
      governance: 2,
      inventory: 2,
      risk: 2,
      vendor: 2,
      incident: 2,
      evidence: 2,
      policy: 2,
    },
  });

  const organization = await ctx.db.get(organizationId);
  if (!organization) return;
  const snapshot = await loadWorkspaceSnapshot(ctx, organization);
  await syncGeneratedActions(ctx, snapshot);

  await logAuditEvent(ctx, {
    organizationId,
    userId: user._id,
    action: "organization.seeded",
    entityType: "organization",
    entityId: organizationId,
    metadata: {
      controls: defaultControls.length,
      vendorPolicies: [dataPolicyId, vendorPolicyId, accessPolicyId, backupPolicyId].length,
    },
  });
}
