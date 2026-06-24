import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { buildOverview, loadWorkspaceSnapshot } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent, maturityLabel, now } from "./_shared";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return null;
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const overview = buildOverview(snapshot);
    return {
      level: active.organization.maturityLevel,
      label: maturityLabel(active.organization.maturityLevel),
      domains: overview.maturitySupport.domains,
      nextLevelActions: overview.maturitySupport.nextLevelActions,
    };
  },
});

export const submit = mutation({
  args: {
    governance: v.number(),
    inventory: v.number(),
    risk: v.number(),
    vendor: v.number(),
    incident: v.number(),
    evidence: v.number(),
    policy: v.number(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const level = Math.round(
      (args.governance + args.inventory + args.risk + args.vendor + args.incident + args.evidence + args.policy) / 7,
    );
    await ctx.db.patch(active.organization._id, {
      maturityLevel: level,
      maturityDomainScores: args,
      updatedAt: now(),
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "maturity.submitted",
      entityType: "organization",
      entityId: active.organization._id,
      metadata: { level, domains: args },
    });
    return { level, label: maturityLabel(level) };
  },
});
