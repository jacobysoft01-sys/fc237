import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, classifyVendor, getActiveOrganization, logAuditEvent, now } from "./_shared";

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
  args: {
    vendorName: v.string(),
    serviceName: v.string(),
    mfa: v.number(),
    encryption: v.number(),
    backup: v.number(),
    dataLocation: v.number(),
    support: v.number(),
    contractClarity: v.number(),
    complianceDocs: v.number(),
    evidenceNotes: v.string(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const scores = {
      mfa: args.mfa,
      encryption: args.encryption,
      backup: args.backup,
      dataLocation: args.dataLocation,
      support: args.support,
      contractClarity: args.contractClarity,
      complianceDocs: args.complianceDocs,
    };
    const score = Math.round((Object.values(scores).reduce((sum, value) => sum + value, 0) / (Object.values(scores).length * 5)) * 100);
    const id = await ctx.db.insert("vendorEvaluations", {
      organizationId: active.organization._id,
      vendorName: args.vendorName,
      serviceName: args.serviceName,
      criteriaScores: scores,
      score,
      classification: classifyVendor(score),
      evidenceNotes: args.evidenceNotes,
      createdAt: now(),
    });
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

