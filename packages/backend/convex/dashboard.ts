import { query } from "./_generated/server";
import { buildOverview, loadWorkspaceSnapshot } from "./_engine";
import { maturityDomains, readinessQuestionBank } from "./_phase1";
import { getActiveOrganization, maturityLabel } from "./_shared";

export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    const emptyReadinessQuestions = readinessQuestionBank.map((question) => ({
      ...question,
      score: 0,
    }));
    const emptyReportPreviews = [
      {
        key: "compliance_readiness_summary",
        title: "Compliance Readiness Summary",
        summary: "Run onboarding and the first readiness cycle to populate the production report.",
      },
      {
        key: "risk_register_preview",
        title: "Risk Register Preview",
        summary: "Score risks after onboarding to preview the register report.",
      },
      {
        key: "action_plan_preview",
        title: "Action Plan Preview",
        summary: "Generated actions appear here after assessments, risks, controls, or policy gaps are stored.",
      },
    ];

    if (!active?.organization) {
      return {
        needsOnboarding: true,
        organization: null,
        user: active?.user ?? null,
        membership: active?.membership ?? null,
        score: {
          overall: 0,
          status: "Critical",
          readiness: 0,
          maturity: 1,
        },
        domainScores: [],
        nextActions: [],
        riskRollup: {
          total: 0,
          highOrCritical: 0,
          byLevel: { critical: 0, high: 0, moderate: 0, low: 0 },
          withoutControls: 0,
        },
        evidenceRollup: {
          requiredSlots: 0,
          submittedSlots: 0,
          acceptedSlots: 0,
          submittedCoverage: 0,
          acceptedCoverage: 0,
          expiringCount: 0,
          missingControlIds: [],
        },
        vendorRollup: {
          total: 0,
          weak: 0,
          outstandingGaps: 0,
        },
        policyRollup: {
          total: 0,
          missingPriorityPolicies: [],
          draftOrExpired: 0,
        },
        incidentRollup: {
          total: 0,
          unresolved: 0,
        },
        aiRollup: {
          total: 0,
          customerFacing: 0,
          pendingApproval: 0,
        },
        readiness: {
          latestAssessmentId: null,
          latestAssessmentScore: 0,
          questions: emptyReadinessQuestions,
        },
        maturitySupport: {
          level: 1,
          domains: maturityDomains.map((domain) => ({
            domain: domain.label,
            key: domain.key,
            score: 1,
          })),
          nextLevelActions: [
            "Create the organization profile.",
            "Select at least one framework.",
            "Run the readiness assessment to create the first baseline.",
          ],
          label: maturityLabel(1),
        },
        assistantInsight: {
          mode: "Ask",
          title: "Start with onboarding",
          summary: "Create the organization profile and run the first readiness cycle to unlock grounded guidance.",
          recommendedActions: [
            "Complete onboarding.",
            "Run the readiness assessment.",
            "Link the first controls and evidence records.",
          ],
        },
        reportPreviews: emptyReportPreviews,
        recentActivity: [],
        topRisks: [],
        controlsNeedingAttention: [],
        cloudServices: [],
        aiSystems: [],
        policies: [],
        incidents: [],
        reports: [],
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
