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
      .query("policies")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("policies", {
      organizationId: active.organization._id,
      createdAt: now(),
      ...args,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "policy.created",
      entityType: "policy",
      entityId: id,
      metadata: { title: args.title },
    });
    return id;
  },
});

export const updateStatus = mutation({
  args: {
    policyId: v.id("policies"),
    status: v.string(),
    reviewDate: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    approvedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const policy = await ctx.db.get(args.policyId);
    if (!policy || policy.organizationId !== active.organization._id) throw new Error("Policy not found");
    await ctx.db.patch(args.policyId, {
      status: args.status,
      reviewDate: args.reviewDate ?? policy.reviewDate,
      expiryDate: args.expiryDate,
      approvedAt: args.approvedAt,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "policy.status_updated",
      entityType: "policy",
      entityId: args.policyId,
      metadata: { status: args.status },
    });
    return args.policyId;
  },
});
