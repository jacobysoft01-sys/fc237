import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
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
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("policies", {
      organizationId: active.organization._id,
      ...args,
      createdAt: now(),
    });
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

