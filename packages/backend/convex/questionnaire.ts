import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { generateQuestionnaireWorkspace } from "./_questionnaire";
import { ensureUser, getActiveOrganization, logAuditEvent } from "./_shared";

export const submitInitialQuestionnaire = mutation({
  args: {
    answers: v.any(),
  },
  handler: async (ctx, args) => {
    const { user } = await ensureUser(ctx);
    const active = await getActiveOrganization(ctx);

    if (active?.organization) {
      throw new Error("Your FC237 workspace is already active. Open the dashboard to continue working from the live command center.");
    }

    const result = await generateQuestionnaireWorkspace(ctx, user, args.answers ?? {});

    await logAuditEvent(ctx, {
      organizationId: result.organizationId,
      userId: user._id,
      action: "questionnaire.initial_submitted",
      entityType: "assessment",
      entityId: result.questionnaireAssessmentId,
      metadata: {
        readinessScore: result.readinessScore,
        risks: result.counts.risks,
        actions: result.generated.generated,
      },
    });

    return result;
  },
});
