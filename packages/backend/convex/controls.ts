import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("controls")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    controlId: v.id("controls"),
    implementationStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const control = await ctx.db.get(args.controlId);
    if (!control || control.organizationId !== active.organization._id) throw new Error("Control not found");
    await ctx.db.patch(args.controlId, { implementationStatus: args.implementationStatus });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "control.status_updated",
      entityType: "control",
      entityId: args.controlId,
      metadata: { implementationStatus: args.implementationStatus },
    });
  },
});

export const updateDetails = mutation({
  args: {
    controlId: v.id("controls"),
    owner: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    implementationGuidance: v.optional(v.string()),
    requiredEvidenceDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant"]);
    const control = await ctx.db.get(args.controlId);
    if (!control || control.organizationId !== active.organization._id) throw new Error("Control not found");
    await ctx.db.patch(args.controlId, {
      owner: args.owner,
      dueDate: args.dueDate,
      implementationGuidance: args.implementationGuidance,
      requiredEvidenceDescription: args.requiredEvidenceDescription,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "control.details_updated",
      entityType: "control",
      entityId: args.controlId,
    });
    return args.controlId;
  },
});
