import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, getActiveOrganization, logAuditEvent, maturityLabel, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("reports")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const generate = mutation({
  args: {
    reportType: v.string(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const [risks, controls, evidence] = await Promise.all([
      ctx.db.query("risks").withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id)).collect(),
      ctx.db.query("controls").withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id)).collect(),
      ctx.db.query("evidence").withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id)).collect(),
    ]);
    const title = `${args.reportType.replaceAll("_", " ")} report`;
    const id = await ctx.db.insert("reports", {
      organizationId: active.organization._id,
      reportType: args.reportType,
      title,
      summary: `${active.organization.name} has a readiness score of ${active.organization.readinessScore}% and maturity level ${active.organization.maturityLevel} (${maturityLabel(active.organization.maturityLevel)}).`,
      readinessScore: active.organization.readinessScore,
      maturityLevel: active.organization.maturityLevel,
      reportData: {
        organization: active.organization.name,
        majorRisks: risks.filter((risk) => ["high", "critical"].includes(risk.riskLevel)).map((risk) => risk.title),
        controls: controls.length,
        evidence: evidence.length,
        disclaimer:
          "This report provides first-level cybersecurity governance and compliance guidance based on the FC237 Framework. It does not replace legal advice, formal audit, penetration testing, or professional cybersecurity assessment.",
      },
      generatedAt: now(),
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "report.generated",
      entityType: "report",
      entityId: id,
      metadata: { reportType: args.reportType },
    });
    return id;
  },
});

