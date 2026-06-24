import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("aiSystems")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("aiSystems", {
      organizationId: active.organization._id,
      ...args,
      owner: args.businessOwner ?? args.owner,
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
      action: "ai_system.created",
      entityType: "aiSystem",
      entityId: id,
      metadata: { name: args.name, riskLevel: args.riskLevel },
    });
    return id;
  },
});
