import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    const items = await ctx.db
      .query("evidence")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
    return items.sort((left, right) => right.uploadedAt - left.uploadedAt);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getActiveOrganization(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("evidence", {
      organizationId: active.organization._id,
      title: args.title,
      evidenceType: args.evidenceType,
      controlId: args.controlId,
      relatedRiskId: args.relatedRiskId,
      relatedVendorEvaluationId: args.relatedVendorEvaluationId,
      relatedPolicyId: args.relatedPolicyId,
      relatedIncidentId: args.relatedIncidentId,
      relatedAssetId: args.relatedAssetId,
      relatedAiSystemId: args.relatedAiSystemId,
      fileStorageId: args.fileStorageId,
      fileName: args.fileName,
      status: args.status,
      reviewNotes: args.reviewNotes,
      submittedBy: args.submittedBy ?? active.user.fullName ?? "Platform user",
      reviewer: args.reviewer,
      expiryDate: args.expiryDate,
      reviewDate: args.reviewDate,
      reviewerComment: args.reviewerComment,
      uploadedBy: active.user._id,
      uploadedAt: now(),
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "evidence.created",
      entityType: "evidence",
      entityId: id,
      metadata: { title: args.title, status: args.status },
    });
    return id;
  },
});

export const updateReviewStatus = mutation({
  args: {
    evidenceId: v.id("evidence"),
    status: v.string(),
    reviewer: v.optional(v.string()),
    reviewDate: v.optional(v.string()),
    reviewerComment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const evidence = await ctx.db.get(args.evidenceId);
    if (!evidence || evidence.organizationId !== active.organization._id) throw new Error("Evidence not found");
    await ctx.db.patch(args.evidenceId, {
      status: args.status,
      reviewer: args.reviewer,
      reviewDate: args.reviewDate,
      reviewerComment: args.reviewerComment,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "evidence.review_updated",
      entityType: "evidence",
      entityId: args.evidenceId,
      metadata: { status: args.status },
    });
    return args.evidenceId;
  },
});
