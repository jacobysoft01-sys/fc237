import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, ensureUser, getActiveOrganization, logAuditEvent, now, seedOrganizationDefaults } from "./_shared";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return null;
    return {
      organization: active.organization,
      membership: active.membership,
      user: active.user,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    sector: v.string(),
    location: v.string(),
    employeeCount: v.number(),
    ictSupportStatus: v.string(),
    cloudUsageStatus: v.string(),
    riskOwner: v.string(),
    cyberFocalPoint: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await ensureUser(ctx);
    const timestamp = now();
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      sector: args.sector,
      location: args.location,
      sizeCategory: args.employeeCount <= 20 ? "small" : args.employeeCount <= 100 ? "medium" : "large",
      employeeCount: args.employeeCount,
      ictSupportStatus: args.ictSupportStatus,
      cloudUsageStatus: args.cloudUsageStatus,
      riskOwner: args.riskOwner,
      cyberFocalPoint: args.cyberFocalPoint,
      readinessScore: 68,
      maturityLevel: 2,
      createdBy: user._id,
      nextReviewDate: "2026-07-17",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await ctx.db.insert("organizationMembers", {
      organizationId,
      userId: user._id,
      role: "owner",
      status: "active",
      createdAt: timestamp,
    });
    await ctx.db.patch(user._id, { activeOrganizationId: organizationId, role: "owner", updatedAt: timestamp });
    await seedOrganizationDefaults(ctx, organizationId, user);
    await logAuditEvent(ctx, {
      organizationId,
      userId: user._id,
      action: "organization.created",
      entityType: "organization",
      entityId: organizationId,
      metadata: { name: args.name },
    });
    return organizationId;
  },
});

export const update = mutation({
  args: {
    name: v.optional(v.string()),
    sector: v.optional(v.string()),
    location: v.optional(v.string()),
    employeeCount: v.optional(v.number()),
    ictSupportStatus: v.optional(v.string()),
    cloudUsageStatus: v.optional(v.string()),
    riskOwner: v.optional(v.string()),
    cyberFocalPoint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant"]);

    const updates = Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined));
    await ctx.db.patch(active.organization._id, {
      ...updates,
      ...(args.employeeCount
        ? { sizeCategory: args.employeeCount <= 20 ? "small" : args.employeeCount <= 100 ? "medium" : "large" }
        : {}),
      updatedAt: now(),
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "organization.updated",
      entityType: "organization",
      entityId: active.organization._id,
    });
    return await ctx.db.get(active.organization._id);
  },
});

