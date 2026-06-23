import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, classifyReadiness, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("assessments")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const submitReadiness = mutation({
  args: {
    cloudInventory: v.number(),
    mfa: v.number(),
    backups: v.number(),
    accessReviews: v.number(),
    vendorReviews: v.number(),
    incidentReadiness: v.number(),
    evidence: v.number(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const score = Math.round(
      ((args.cloudInventory + args.mfa + args.backups + args.accessReviews + args.vendorReviews + args.incidentReadiness + args.evidence) /
        35) *
        100,
    );
    const timestamp = now();
    const id = await ctx.db.insert("assessments", {
      organizationId: active.organization._id,
      type: "readiness",
      status: "submitted",
      score,
      classification: classifyReadiness(score),
      startedAt: timestamp,
      submittedAt: timestamp,
    });
    await ctx.db.patch(active.organization._id, { readinessScore: score, updatedAt: timestamp });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "assessment.submitted",
      entityType: "assessment",
      entityId: id,
      metadata: { type: "readiness", score },
    });
    return id;
  },
});

