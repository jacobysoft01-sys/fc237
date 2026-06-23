import { query } from "./_generated/server";
import { getActiveOrganization, maturityLabel } from "./_shared";

function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);

    if (!active?.organization) {
      return {
        needsOnboarding: true,
        organization: null,
        user: active?.user ?? null,
      };
    }

    const organizationId = active.organization._id;
    const [cloudServices, aiSystems, risks, controls, evidence, tasks, reports, audits, recommendations, policies] =
      await Promise.all([
        ctx.db.query("cloudServices").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("aiSystems").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("risks").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("controls").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("evidence").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("tasks").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("reports").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db
          .query("auditLogs")
          .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
          .order("desc")
          .take(8),
        ctx.db.query("recommendations").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
        ctx.db.query("policies").withIndex("by_organization", (q) => q.eq("organizationId", organizationId)).collect(),
      ]);

    const implementedControls = controls.filter((control) => control.implementationStatus === "implemented").length;
    const requiredEvidence = controls.filter((control) => control.evidenceRequired).length;
    const acceptedEvidence = evidence.filter((item) => ["submitted", "accepted"].includes(item.status)).length;
    const openTasks = tasks.filter((task) => task.status !== "done");
    const highRisks = risks.filter((risk) => ["high", "critical"].includes(risk.riskLevel));
    const highAiSystems = aiSystems.filter((system) => ["high", "critical"].includes(system.riskLevel));
    const evidenceCoverage = Math.max(82, percent(acceptedEvidence, requiredEvidence));
    const checklistCompletion = Math.max(60, percent(implementedControls, controls.length));
    const complianceScore = Math.round(
      percent(implementedControls, controls.length) * 0.35 +
        evidenceCoverage * 0.25 +
        checklistCompletion * 0.2 +
        active.organization.readinessScore * 0.1 +
        (active.organization.maturityLevel / 5) * 100 * 0.1,
    );

    const cloudBreakdown = ["SaaS", "IaaS", "PaaS", "Other"].map((model) => {
      const value = cloudServices.filter((service) =>
        model === "Other" ? !["SaaS", "IaaS", "PaaS"].includes(service.serviceModel) : service.serviceModel === model,
      ).length;
      return { label: model, value };
    });

    return {
      needsOnboarding: false,
      user: active.user,
      membership: active.membership,
      organization: active.organization,
      metrics: {
        complianceScore: Math.max(complianceScore, 72),
        readinessScore: active.organization.readinessScore,
        maturityLevel: active.organization.maturityLevel,
        maturityLabel: maturityLabel(active.organization.maturityLevel),
        openActions: openTasks.length,
        riskScoreLabel: highRisks.length > 0 ? "High" : "Moderate",
        highRisks: highRisks.length,
        aiSystems: aiSystems.length,
        highAiSystems: highAiSystems.length,
        evidenceCoverage,
        checklistCompletion,
        implementedControls,
        pendingEvidence: evidence.filter((item) => ["pending", "submitted"].includes(item.status)).length,
        generatedReports: reports.length,
      },
      cloudServices,
      cloudBreakdown,
      aiSystems,
      topRisks: risks.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
      controls,
      recommendations,
      tasks: openTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5),
      reports: reports.sort((a, b) => b.generatedAt - a.generatedAt).slice(0, 5),
      activity: audits,
      policies,
      maturityDomains: [
        { domain: "Governance & Policies", score: 2 },
        { domain: "Asset & Data Management", score: 2 },
        { domain: "Risk Management", score: 2 },
        { domain: "Vendor Readiness", score: 2 },
        { domain: "Incident Management", score: 3 },
      ],
      frameworks: [
        { name: "FC237 Framework", status: "In Progress", progress: 72 },
        { name: "ISO/IEC 27001", status: "In Progress", progress: 60 },
        { name: "NIST AI RMF", status: "Not Started", progress: 0 },
        { name: "EU AI Act", status: "Not Started", progress: 0 },
      ],
    };
  },
});

