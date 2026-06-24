import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { buildOverview, loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { readinessQuestionBank } from "./_phase1";
import { assertRole, classifyReadiness, getActiveOrganization, logAuditEvent, now } from "./_shared";

const answerValidator = v.object({
  questionKey: v.string(),
  answer: v.string(),
  score: v.number(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    const assessments = await ctx.db
      .query("assessments")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();

    return await Promise.all(
      assessments
        .sort((left, right) => (right.submittedAt ?? right.startedAt) - (left.submittedAt ?? left.startedAt))
        .map(async (assessment) => {
          const responses = await ctx.db
            .query("assessmentResponses")
            .withIndex("by_assessment", (q) => q.eq("assessmentId", assessment._id))
            .collect();
          return {
            ...assessment,
            responses,
          };
        }),
    );
  },
});

export const getReadinessQuestionBank = query({
  args: {},
  handler: async () => readinessQuestionBank,
});

export const submitReadiness = mutation({
  args: {
    answers: v.array(answerValidator),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);

    const score = Math.round((args.answers.reduce((sum, answer) => sum + answer.score, 0) / (args.answers.length * 5)) * 100);
    const timestamp = now();
    const assessmentId = await ctx.db.insert("assessments", {
      organizationId: active.organization._id,
      type: "readiness",
      status: "submitted",
      score,
      classification: classifyReadiness(score),
      summary: args.summary,
      startedAt: timestamp,
      submittedAt: timestamp,
    });

    await Promise.all(
      args.answers.map((answer) => {
        const question = readinessQuestionBank.find((item) => item.key === answer.questionKey);
        return ctx.db.insert("assessmentResponses", {
          assessmentId,
          questionKey: answer.questionKey,
          answer: answer.answer,
          score: answer.score,
          domain: question?.domain,
          createdAt: timestamp,
        });
      }),
    );

    await ctx.db.patch(active.organization._id, { readinessScore: score, updatedAt: timestamp });
    const organization = await ctx.db.get(active.organization._id);
    let generated = { created: 0, updated: 0, generated: 0 };
    let overview = null;

    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      generated = await syncGeneratedActions(ctx, snapshot);
      overview = buildOverview(snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "assessment.submitted",
      entityType: "assessment",
      entityId: assessmentId,
      metadata: { type: "readiness", score },
    });

    return { assessmentId, score, generated, overview };
  },
});

export const generateFollowUpActions = mutation({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const result = await syncGeneratedActions(ctx, snapshot);
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "assessment.follow_up_actions_generated",
      entityType: "organization",
      entityId: active.organization._id,
      metadata: result,
    });
    return result;
  },
});
