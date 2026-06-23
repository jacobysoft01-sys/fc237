import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, getActiveOrganization, logAuditEvent, maturityLabel, now } from "./_shared";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return null;
    return {
      level: active.organization.maturityLevel,
      label: maturityLabel(active.organization.maturityLevel),
      domains: [
        { domain: "Governance & Policies", score: active.organization.maturityLevel },
        { domain: "Asset & Data Management", score: Math.max(1, active.organization.maturityLevel) },
        { domain: "Risk Management", score: Math.max(1, active.organization.maturityLevel) },
        { domain: "Vendor Readiness", score: Math.max(1, active.organization.maturityLevel - 1) },
        { domain: "Incident Management", score: Math.min(5, active.organization.maturityLevel + 1) },
      ],
      nextLevelActions: [
        "Formalize ownership and review cadence",
        "Connect controls to evidence records",
        "Complete vendor reassessment for high-risk providers",
        "Run an incident response drill",
      ],
    };
  },
});

export const submit = mutation({
  args: {
    governance: v.number(),
    assets: v.number(),
    risks: v.number(),
    vendors: v.number(),
    incidents: v.number(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const level = Math.round((args.governance + args.assets + args.risks + args.vendors + args.incidents) / 5);
    await ctx.db.patch(active.organization._id, { maturityLevel: level, updatedAt: now() });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "maturity.submitted",
      entityType: "organization",
      entityId: active.organization._id,
      metadata: { level },
    });
    return { level, label: maturityLabel(level) };
  },
});

