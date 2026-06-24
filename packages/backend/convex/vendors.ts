import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, classifyVendor, getActiveOrganization, logAuditEvent, now } from "./_shared";

const vendorArgs = {
  vendorName: v.string(),
  serviceName: v.string(),
  mfa: v.number(),
  encryption: v.number(),
  backup: v.number(),
  dataLocation: v.number(),
  support: v.number(),
  contractClarity: v.number(),
  complianceDocs: v.number(),
  accessControl: v.optional(v.number()),
  logging: v.optional(v.number()),
  incidentSupport: v.optional(v.number()),
  vendorCategory: v.optional(v.string()),
  website: v.optional(v.string()),
  relationshipOwner: v.optional(v.string()),
  headquarters: v.optional(v.string()),
  dataHostingLocation: v.optional(v.string()),
  contractRenewalDate: v.optional(v.string()),
  dataProcessingAgreement: v.optional(v.boolean()),
  subprocessorsDisclosed: v.optional(v.boolean()),
  privacyNoticeReviewed: v.optional(v.boolean()),
  certifications: v.optional(v.array(v.string())),
  documentsReceived: v.optional(v.array(v.string())),
  outstandingGaps: v.optional(v.array(v.string())),
  relatedAiSystemIds: v.optional(v.array(v.id("aiSystems"))),
  relatedCloudServiceIds: v.optional(v.array(v.id("cloudServices"))),
  evidenceNotes: v.string(),
};

function computeVendorScore(args: {
  mfa: number;
  encryption: number;
  backup: number;
  dataLocation: number;
  support: number;
  contractClarity: number;
  complianceDocs: number;
  accessControl?: number;
  logging?: number;
  incidentSupport?: number;
}) {
  const scores = [
    args.mfa,
    args.encryption,
    args.backup,
    args.dataLocation,
    args.support,
    args.contractClarity,
    args.complianceDocs,
    args.accessControl,
    args.logging,
    args.incidentSupport,
  ].filter((value): value is number => typeof value === "number");
  return Math.round((scores.reduce((sum, value) => sum + value, 0) / (scores.length * 5)) * 100);
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("vendorEvaluations")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: vendorArgs,
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);

    const criteriaScores = {
      mfa: args.mfa,
      encryption: args.encryption,
      backup: args.backup,
      dataLocation: args.dataLocation,
      support: args.support,
      contractClarity: args.contractClarity,
      complianceDocs: args.complianceDocs,
      accessControl: args.accessControl,
      logging: args.logging,
      incidentSupport: args.incidentSupport,
    };
    const score = computeVendorScore(criteriaScores);
    const id = await ctx.db.insert("vendorEvaluations", {
      organizationId: active.organization._id,
      vendorName: args.vendorName,
      serviceName: args.serviceName,
      criteriaScores,
      score,
      classification: classifyVendor(score),
      evidenceNotes: args.evidenceNotes,
      identity: {
        vendorCategory: args.vendorCategory,
        website: args.website,
        relationshipOwner: args.relationshipOwner,
        headquarters: args.headquarters,
        dataHostingLocation: args.dataHostingLocation,
        contractRenewalDate: args.contractRenewalDate,
      },
      security: {
        mfa: args.mfa,
        encryption: args.encryption,
        backup: args.backup,
        accessControl: args.accessControl,
        logging: args.logging,
        incidentSupport: args.incidentSupport,
      },
      compliance: {
        dataProcessingAgreement: args.dataProcessingAgreement,
        subprocessorsDisclosed: args.subprocessorsDisclosed,
        privacyNoticeReviewed: args.privacyNoticeReviewed,
        certifications: args.certifications,
        complianceDocsScore: args.complianceDocs,
      },
      evidenceSection: {
        documentsReceived: args.documentsReceived,
        outstandingGaps: args.outstandingGaps,
        lastReviewedAt: new Date(now()).toISOString().slice(0, 10),
      },
      relatedAiSystemIds: args.relatedAiSystemIds,
      relatedCloudServiceIds: args.relatedCloudServiceIds,
      createdAt: now(),
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "vendor_evaluation.created",
      entityType: "vendorEvaluation",
      entityId: id,
      metadata: { vendorName: args.vendorName, score },
    });
    return id;
  },
});

export const update = mutation({
  args: {
    vendorEvaluationId: v.id("vendorEvaluations"),
    ...vendorArgs,
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const vendor = await ctx.db.get(args.vendorEvaluationId);
    if (!vendor || vendor.organizationId !== active.organization._id) throw new Error("Vendor evaluation not found");

    const criteriaScores = {
      mfa: args.mfa,
      encryption: args.encryption,
      backup: args.backup,
      dataLocation: args.dataLocation,
      support: args.support,
      contractClarity: args.contractClarity,
      complianceDocs: args.complianceDocs,
      accessControl: args.accessControl,
      logging: args.logging,
      incidentSupport: args.incidentSupport,
    };
    const score = computeVendorScore(criteriaScores);
    await ctx.db.patch(args.vendorEvaluationId, {
      vendorName: args.vendorName,
      serviceName: args.serviceName,
      criteriaScores,
      score,
      classification: classifyVendor(score),
      evidenceNotes: args.evidenceNotes,
      identity: {
        vendorCategory: args.vendorCategory,
        website: args.website,
        relationshipOwner: args.relationshipOwner,
        headquarters: args.headquarters,
        dataHostingLocation: args.dataHostingLocation,
        contractRenewalDate: args.contractRenewalDate,
      },
      security: {
        mfa: args.mfa,
        encryption: args.encryption,
        backup: args.backup,
        accessControl: args.accessControl,
        logging: args.logging,
        incidentSupport: args.incidentSupport,
      },
      compliance: {
        dataProcessingAgreement: args.dataProcessingAgreement,
        subprocessorsDisclosed: args.subprocessorsDisclosed,
        privacyNoticeReviewed: args.privacyNoticeReviewed,
        certifications: args.certifications,
        complianceDocsScore: args.complianceDocs,
      },
      evidenceSection: {
        documentsReceived: args.documentsReceived,
        outstandingGaps: args.outstandingGaps,
        lastReviewedAt: new Date(now()).toISOString().slice(0, 10),
      },
      relatedAiSystemIds: args.relatedAiSystemIds,
      relatedCloudServiceIds: args.relatedCloudServiceIds,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "vendor_evaluation.updated",
      entityType: "vendorEvaluation",
      entityId: args.vendorEvaluationId,
      metadata: { vendorName: args.vendorName, score },
    });
    return args.vendorEvaluationId;
  },
});
