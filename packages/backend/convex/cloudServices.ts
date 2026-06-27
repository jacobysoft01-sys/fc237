import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("cloudServices")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    serviceName: v.string(),
    providerName: v.string(),
    serviceModel: v.string(),
    purpose: v.string(),
    dataStored: v.string(),
    approved: v.boolean(),
    owner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("cloudServices", {
      organizationId: active.organization._id,
      ...args,
      createdAt: now(),
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "cloud_service.created",
      entityType: "cloudService",
      entityId: id,
      metadata: { serviceName: args.serviceName },
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("cloudServices"),
    serviceName: v.optional(v.string()),
    providerName: v.optional(v.string()),
    serviceModel: v.optional(v.string()),
    purpose: v.optional(v.string()),
    dataStored: v.optional(v.string()),
    approved: v.optional(v.boolean()),
    owner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);

    const record = await ctx.db.get(args.id);
    if (!record || record.organizationId !== active.organization._id) {
      throw new Error("The selected cloud service could not be found.");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "cloud_service.updated",
      entityType: "cloudService",
      entityId: id,
      metadata: { serviceName: args.serviceName ?? record.serviceName },
    });

    return await ctx.db.get(id);
  },
});

