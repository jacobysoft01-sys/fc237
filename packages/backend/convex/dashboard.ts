import { query } from "./_generated/server";
import { buildOverview, loadWorkspaceSnapshot } from "./_engine";
import { getActiveOrganization, maturityLabel } from "./_shared";

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

    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const overview = buildOverview(snapshot);

    return {
      needsOnboarding: false,
      user: active.user,
      membership: active.membership,
      organization: active.organization,
      score: overview.score,
      domainScores: overview.domainScores,
      nextActions: overview.nextActions,
      riskRollup: overview.riskRollup,
      evidenceRollup: overview.evidenceRollup,
      vendorRollup: overview.vendorRollup,
      policyRollup: overview.policyRollup,
      incidentRollup: overview.incidentRollup,
      aiRollup: overview.aiRollup,
      readiness: overview.readiness,
      maturitySupport: {
        ...overview.maturitySupport,
        label: maturityLabel(active.organization.maturityLevel),
      },
      assistantInsight: overview.assistantInsight,
      reportPreviews: overview.reportPreviews,
      recentActivity: overview.recentActivity,
      topRisks: overview.topRisks,
      controlsNeedingAttention: overview.controlsNeedingAttention,
      cloudServices: snapshot.cloudServices,
      aiSystems: snapshot.aiSystems,
      policies: snapshot.policies,
      incidents: snapshot.incidents,
      reports: snapshot.reports.sort((left, right) => right.generatedAt - left.generatedAt).slice(0, 5),
    };
  },
});
