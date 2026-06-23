import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
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
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("aiSystems", {
      organizationId: active.organization._id,
      ...args,
      createdAt: now(),
    });
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

