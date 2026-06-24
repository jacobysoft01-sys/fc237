import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { buildComplianceReport, buildOverview, loadWorkspaceSnapshot } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

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

export const getPreview = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return null;
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const overview = buildOverview(snapshot);
    return {
      complianceSummary: buildComplianceReport(snapshot),
      riskRegisterPreview: overview.topRisks,
      actionPlanPreview: overview.nextActions,
    };
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
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const complianceReport = buildComplianceReport(snapshot);

    const reportPayload =
      args.reportType === "compliance_readiness_summary"
        ? complianceReport
        : {
            title: args.reportType.replaceAll("_", " "),
            summary:
              args.reportType === "risk_register_preview"
                ? `${snapshot.risks.length} risks tracked for preview reporting.`
                : `${snapshot.tasks.length} action items tracked for preview reporting.`,
            reportData:
              args.reportType === "risk_register_preview"
                ? complianceReport.reportData.topRisks
                : complianceReport.reportData.nextActions,
          };

    const id = await ctx.db.insert("reports", {
      organizationId: active.organization._id,
      reportType: args.reportType,
      title: reportPayload.title,
      summary: reportPayload.summary,
      readinessScore: snapshot.organization.readinessScore,
      maturityLevel: snapshot.organization.maturityLevel,
      reportData: reportPayload.reportData,
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
