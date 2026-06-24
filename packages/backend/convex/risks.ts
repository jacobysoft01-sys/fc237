import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, calculateRiskScore, classifyRisk, getActiveOrganization, logAuditEvent, now } from "./_shared";

const riskArgs = {
  title: v.string(),
  category: v.string(),
  likelihood: v.number(),
  impact: v.number(),
  owner: v.string(),
  remediationStatus: v.string(),
  description: v.optional(v.string()),
  rootCause: v.optional(v.string()),
  dueDate: v.optional(v.string()),
  treatmentOption: v.optional(v.string()),
  status: v.optional(v.string()),
  requiredEvidenceSummary: v.optional(v.string()),
  relatedAiSystemId: v.optional(v.id("aiSystems")),
  relatedCloudServiceId: v.optional(v.id("cloudServices")),
  relatedVendorEvaluationId: v.optional(v.id("vendorEvaluations")),
  relatedControlIds: v.optional(v.array(v.id("controls"))),
  relatedEvidenceIds: v.optional(v.array(v.id("evidence"))),
  relatedAssetId: v.optional(v.id("dataAssets")),
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    const risks = await ctx.db
      .query("risks")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
    return risks.sort((left, right) => right.riskScore - left.riskScore);
  },
});

export const create = mutation({
  args: riskArgs,
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const riskScore = calculateRiskScore(args.likelihood, args.impact);
    const id = await ctx.db.insert("risks", {
      organizationId: active.organization._id,
      riskScore,
      riskLevel: classifyRisk(riskScore),
      treatmentStatus: args.treatmentOption ?? "mitigate",
      status: args.status ?? "open",
      createdAt: now(),
      ...args,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "risk.created",
      entityType: "risk",
      entityId: id,
      metadata: { title: args.title, riskScore },
    });
    return id;
  },
});

export const update = mutation({
  args: {
    riskId: v.id("risks"),
    ...riskArgs,
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const risk = await ctx.db.get(args.riskId);
    if (!risk || risk.organizationId !== active.organization._id) throw new Error("Risk not found");
    const riskScore = calculateRiskScore(args.likelihood, args.impact);
    await ctx.db.patch(args.riskId, {
      title: args.title,
      category: args.category,
      likelihood: args.likelihood,
      impact: args.impact,
      riskScore,
      riskLevel: classifyRisk(riskScore),
      owner: args.owner,
      remediationStatus: args.remediationStatus,
      description: args.description,
      rootCause: args.rootCause,
      dueDate: args.dueDate,
      treatmentOption: args.treatmentOption,
      treatmentStatus: args.treatmentOption ?? risk.treatmentStatus,
      status: args.status ?? risk.status,
      requiredEvidenceSummary: args.requiredEvidenceSummary,
      relatedAiSystemId: args.relatedAiSystemId,
      relatedCloudServiceId: args.relatedCloudServiceId,
      relatedVendorEvaluationId: args.relatedVendorEvaluationId,
      relatedControlIds: args.relatedControlIds,
      relatedEvidenceIds: args.relatedEvidenceIds,
      relatedAssetId: args.relatedAssetId,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "risk.updated",
      entityType: "risk",
      entityId: args.riskId,
      metadata: { title: args.title, riskScore },
    });
    return args.riskId;
  },
});
