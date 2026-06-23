import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_type", ["organizationId", "type"]),

  assessmentResponses: defineTable({
    assessmentId: v.id("assessments"),
    questionKey: v.string(),
    answer: v.string(),
    score: v.number(),
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
    relatedAiSystemId: v.optional(v.id("aiSystems")),
    relatedCloudServiceId: v.optional(v.id("cloudServices")),
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
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  evidence: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    evidenceType: v.string(),
    controlId: v.optional(v.id("controls")),
    fileStorageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    status: v.string(),
    reviewNotes: v.optional(v.string()),
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
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  tasks: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    priority: v.string(),
    status: v.string(),
    dueDate: v.string(),
    sourceType: v.string(),
    sourceId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_status", ["organizationId", "status"]),

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
