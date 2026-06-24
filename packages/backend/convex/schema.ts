import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const organizationContactsValidator = v.object({
  primaryName: v.optional(v.string()),
  primaryEmail: v.optional(v.string()),
  primaryPhone: v.optional(v.string()),
  complianceLead: v.optional(v.string()),
  complianceEmail: v.optional(v.string()),
  technicalLead: v.optional(v.string()),
  technicalEmail: v.optional(v.string()),
});

const organizationPreferencesValidator = v.object({
  reportingFrequency: v.optional(v.string()),
  reminderCadence: v.optional(v.string()),
  notificationEmail: v.optional(v.boolean()),
  notificationDashboard: v.optional(v.boolean()),
  weeklyDigest: v.optional(v.boolean()),
  languagePreference: v.optional(v.string()),
});

const organizationBrandingValidator = v.object({
  shortName: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
});

const frameworkMappingDetailsValidator = v.object({
  framework: v.string(),
  reference: v.optional(v.string()),
  note: v.optional(v.string()),
});

const vendorIdentityValidator = v.object({
  vendorCategory: v.optional(v.string()),
  website: v.optional(v.string()),
  relationshipOwner: v.optional(v.string()),
  headquarters: v.optional(v.string()),
  dataHostingLocation: v.optional(v.string()),
  contractRenewalDate: v.optional(v.string()),
});

const vendorSecurityValidator = v.object({
  mfa: v.number(),
  encryption: v.number(),
  backup: v.number(),
  accessControl: v.optional(v.number()),
  logging: v.optional(v.number()),
  incidentSupport: v.optional(v.number()),
});

const vendorComplianceValidator = v.object({
  dataProcessingAgreement: v.optional(v.boolean()),
  subprocessorsDisclosed: v.optional(v.boolean()),
  privacyNoticeReviewed: v.optional(v.boolean()),
  certifications: v.optional(v.array(v.string())),
  complianceDocsScore: v.optional(v.number()),
});

const vendorEvidenceValidator = v.object({
  documentsReceived: v.optional(v.array(v.string())),
  outstandingGaps: v.optional(v.array(v.string())),
  lastReviewedAt: v.optional(v.string()),
});

const maturityDomainScoresValidator = v.object({
  governance: v.optional(v.number()),
  inventory: v.optional(v.number()),
  risk: v.optional(v.number()),
  vendor: v.optional(v.number()),
  incident: v.optional(v.number()),
  evidence: v.optional(v.number()),
  policy: v.optional(v.number()),
});

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    fullName: v.optional(v.string()),
    role: v.string(),
    activeOrganizationId: v.optional(v.id("organizations")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  organizations: defineTable({
    name: v.string(),
    sector: v.string(),
    location: v.string(),
    sizeCategory: v.string(),
    employeeCount: v.number(),
    ictSupportStatus: v.string(),
    cloudUsageStatus: v.string(),
    riskOwner: v.string(),
    cyberFocalPoint: v.string(),
    readinessScore: v.number(),
    maturityLevel: v.number(),
    createdBy: v.id("users"),
    nextReviewDate: v.optional(v.string()),
    companyProfile: v.optional(v.string()),
    website: v.optional(v.string()),
    contacts: v.optional(organizationContactsValidator),
    selectedFrameworks: v.optional(v.array(v.string())),
    preferences: v.optional(organizationPreferencesValidator),
    branding: v.optional(organizationBrandingValidator),
    maturityDomainScores: v.optional(maturityDomainScoresValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_organization_user", ["organizationId", "userId"]),

  organizationInvitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    status: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_token", ["token"]),

  cloudServices: defineTable({
    organizationId: v.id("organizations"),
    serviceName: v.string(),
    providerName: v.string(),
    serviceModel: v.string(),
    purpose: v.string(),
    dataStored: v.string(),
    approved: v.boolean(),
    owner: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  aiSystems: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    owner: v.string(),
    vendor: v.string(),
    modelOrService: v.string(),
    purpose: v.string(),
    dataSensitivity: v.string(),
    riskLevel: v.string(),
    status: v.string(),
    businessOwner: v.optional(v.string()),
    technicalOwner: v.optional(v.string()),
    department: v.optional(v.string()),
    internalExternalFlag: v.optional(v.string()),
    usePurpose: v.optional(v.string()),
    reviewDate: v.optional(v.string()),
    personalDataFlags: v.optional(v.array(v.string())),
    sensitiveDataFlag: v.optional(v.boolean()),
    customerFacingFlag: v.optional(v.boolean()),
    automatedDecisionFlag: v.optional(v.boolean()),
    humanReviewFlag: v.optional(v.boolean()),
    businessCriticality: v.optional(v.string()),
    approvalStatus: v.optional(v.string()),
    relatedPolicyId: v.optional(v.id("policies")),
    relatedVendorEvaluationId: v.optional(v.id("vendorEvaluations")),
    relatedControlIds: v.optional(v.array(v.id("controls"))),
    relatedEvidenceIds: v.optional(v.array(v.id("evidence"))),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_level", ["organizationId", "riskLevel"]),

  dataAssets: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    classification: v.string(),
    cloudServiceId: v.optional(v.id("cloudServices")),
    aiSystemId: v.optional(v.id("aiSystems")),
    retentionGuidance: v.string(),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  assessments: defineTable({
    organizationId: v.id("organizations"),
    type: v.string(),
    status: v.string(),
    score: v.number(),
    classification: v.string(),
    startedAt: v.number(),
    submittedAt: v.optional(v.number()),
    summary: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_type", ["organizationId", "type"]),

  assessmentResponses: defineTable({
    assessmentId: v.id("assessments"),
    questionKey: v.string(),
    answer: v.string(),
    score: v.number(),
    domain: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_assessment", ["assessmentId"]),

  risks: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    category: v.string(),
    likelihood: v.number(),
    impact: v.number(),
    riskScore: v.number(),
    riskLevel: v.string(),
    owner: v.string(),
    treatmentStatus: v.string(),
    remediationStatus: v.string(),
    description: v.optional(v.string()),
    rootCause: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    treatmentOption: v.optional(v.string()),
    status: v.optional(v.string()),
    requiredEvidenceSummary: v.optional(v.string()),
    relatedAiSystemId: v.optional(v.id("aiSystems")),
    relatedCloudServiceId: v.optional(v.id("cloudServices")),
    relatedVendorEvaluationId: v.optional(v.id("vendorEvaluations")),
    relatedControlIds: v.optional(v.array(v.id("controls"))),
    relatedEvidenceIds: v.optional(v.array(v.id("evidence"))),
    relatedAssetId: v.optional(v.id("dataAssets")),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_level", ["organizationId", "riskLevel"]),

  controls: defineTable({
    organizationId: v.id("organizations"),
    controlKey: v.string(),
    name: v.string(),
    description: v.string(),
    pillar: v.string(),
    priority: v.string(),
    implementationStatus: v.string(),
    evidenceRequired: v.boolean(),
    frameworkMappings: v.array(v.string()),
    domain: v.optional(v.string()),
    owner: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    implementationGuidance: v.optional(v.string()),
    requiredEvidenceDescription: v.optional(v.string()),
    frameworkMappingDetails: v.optional(v.array(frameworkMappingDetailsValidator)),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_status", ["organizationId", "implementationStatus"]),

  recommendations: defineTable({
    organizationId: v.id("organizations"),
    sourceType: v.string(),
    sourceId: v.optional(v.string()),
    title: v.string(),
    plainLanguageExplanation: v.string(),
    priority: v.string(),
    pillar: v.string(),
    evidenceRequired: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_status", ["organizationId", "status"]),

  vendorEvaluations: defineTable({
    organizationId: v.id("organizations"),
    vendorName: v.string(),
    serviceName: v.string(),
    criteriaScores: v.any(),
    score: v.number(),
    classification: v.string(),
    evidenceNotes: v.string(),
    identity: v.optional(vendorIdentityValidator),
    security: v.optional(vendorSecurityValidator),
    compliance: v.optional(vendorComplianceValidator),
    evidenceSection: v.optional(vendorEvidenceValidator),
    relatedAiSystemIds: v.optional(v.array(v.id("aiSystems"))),
    relatedCloudServiceIds: v.optional(v.array(v.id("cloudServices"))),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  evidence: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    evidenceType: v.string(),
    controlId: v.optional(v.id("controls")),
    relatedRiskId: v.optional(v.id("risks")),
    relatedVendorEvaluationId: v.optional(v.id("vendorEvaluations")),
    relatedPolicyId: v.optional(v.id("policies")),
    relatedIncidentId: v.optional(v.id("incidents")),
    relatedAssetId: v.optional(v.id("dataAssets")),
    relatedAiSystemId: v.optional(v.id("aiSystems")),
    fileStorageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    status: v.string(),
    reviewNotes: v.optional(v.string()),
    submittedBy: v.optional(v.string()),
    reviewer: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    reviewDate: v.optional(v.string()),
    reviewerComment: v.optional(v.string()),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_status", ["organizationId", "status"]),

  incidents: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    category: v.string(),
    severity: v.string(),
    status: v.string(),
    detectedAt: v.string(),
    responseActions: v.array(v.string()),
    escalationRecommended: v.boolean(),
    owner: v.optional(v.string()),
    resolutionSummary: v.optional(v.string()),
    resolvedAt: v.optional(v.string()),
    relatedPolicyId: v.optional(v.id("policies")),
    relatedControlIds: v.optional(v.array(v.id("controls"))),
    relatedEvidenceIds: v.optional(v.array(v.id("evidence"))),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  reports: defineTable({
    organizationId: v.id("organizations"),
    reportType: v.string(),
    title: v.string(),
    summary: v.string(),
    readinessScore: v.number(),
    maturityLevel: v.number(),
    reportData: v.any(),
    generatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_generatedAt", ["organizationId", "generatedAt"]),

  chatSessions: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    senderType: v.string(),
    content: v.string(),
    detectedIntent: v.optional(v.string()),
    structuredResponse: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_session", ["sessionId"]),

  knowledgeBaseEntries: defineTable({
    title: v.string(),
    intent: v.string(),
    category: v.string(),
    content: v.string(),
    recommendedActions: v.array(v.string()),
    evidenceToKeep: v.array(v.string()),
    priority: v.string(),
    version: v.number(),
    status: v.string(),
    updatedAt: v.number(),
  })
    .index("by_intent", ["intent"])
    .index("by_status", ["status"]),

  frameworkMappings: defineTable({
    fc237ControlKey: v.string(),
    framework: v.string(),
    externalReference: v.string(),
    description: v.string(),
  })
    .index("by_fc237", ["fc237ControlKey"])
    .index("by_framework", ["framework"]),

  policies: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    type: v.string(),
    status: v.string(),
    owner: v.string(),
    reviewDate: v.string(),
    priority: v.optional(v.string()),
    summary: v.optional(v.string()),
    templateKey: v.optional(v.string()),
    effectiveDate: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    approvedAt: v.optional(v.string()),
    relatedControlIds: v.optional(v.array(v.id("controls"))),
    relatedEvidenceIds: v.optional(v.array(v.id("evidence"))),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  tasks: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    description: v.optional(v.string()),
    owner: v.optional(v.string()),
    priority: v.string(),
    status: v.string(),
    dueDate: v.string(),
    sourceType: v.string(),
    sourceId: v.optional(v.string()),
    relatedRiskId: v.optional(v.id("risks")),
    relatedControlId: v.optional(v.id("controls")),
    relatedEvidenceId: v.optional(v.id("evidence")),
    relatedVendorEvaluationId: v.optional(v.id("vendorEvaluations")),
    relatedAssessmentId: v.optional(v.id("assessments")),
    relatedIncidentId: v.optional(v.id("incidents")),
    relatedPolicyId: v.optional(v.id("policies")),
    completionNotes: v.optional(v.string()),
    createdByEngine: v.optional(v.boolean()),
    generatedKey: v.optional(v.string()),
    lastEvaluatedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_status", ["organizationId", "status"])
    .index("by_organization_source", ["organizationId", "sourceType"]),

  auditLogs: defineTable({
    organizationId: v.id("organizations"),
    userId: v.optional(v.id("users")),
    action: v.string(),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_createdAt", ["organizationId", "createdAt"]),
});
