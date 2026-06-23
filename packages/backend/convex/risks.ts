import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, calculateRiskScore, classifyRisk, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("risks")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    likelihood: v.number(),
    impact: v.number(),
    owner: v.string(),
    remediationStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const riskScore = calculateRiskScore(args.likelihood, args.impact);
    const id = await ctx.db.insert("risks", {
      organizationId: active.organization._id,
      title: args.title,
      category: args.category,
      likelihood: args.likelihood,
      impact: args.impact,
      riskScore,
      riskLevel: classifyRisk(riskScore),
      owner: args.owner,
      treatmentStatus: "mitigate",
      remediationStatus: args.remediationStatus,
      createdAt: now(),
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "risk.created",
      entityType: "risk",
      entityId: id,
      metadata: { title: args.title, riskScore },
    });
    return id;
  },
});

