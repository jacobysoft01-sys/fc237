import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

const highEscalationCategories = ["ransomware", "data leakage", "hacked cloud account", "hacked email account"];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("incidents")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    severity: v.string(),
    detectedAt: v.string(),
    owner: v.optional(v.string()),
    relatedPolicyId: v.optional(v.id("policies")),
    relatedControlIds: v.optional(v.array(v.id("controls"))),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const escalationRecommended = highEscalationCategories.includes(args.category) || args.severity === "critical";
    const id = await ctx.db.insert("incidents", {
      organizationId: active.organization._id,
      title: args.title,
      category: args.category,
      severity: args.severity,
      status: "open",
      detectedAt: args.detectedAt,
      responseActions: [
        "Record the time and scope of the incident",
        "Preserve screenshots and logs",
        "Change affected passwords and revoke suspicious sessions",
        "Contact the cloud provider if account compromise is suspected",
      ],
      escalationRecommended,
      owner: args.owner,
      relatedPolicyId: args.relatedPolicyId,
      relatedControlIds: args.relatedControlIds,
      createdAt: now(),
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "incident.created",
      entityType: "incident",
      entityId: id,
      metadata: { title: args.title, escalationRecommended },
    });
    return id;
  },
});

export const updateStatus = mutation({
  args: {
    incidentId: v.id("incidents"),
    status: v.string(),
    resolutionSummary: v.optional(v.string()),
    resolvedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const incident = await ctx.db.get(args.incidentId);
    if (!incident || incident.organizationId !== active.organization._id) throw new Error("Incident not found");
    await ctx.db.patch(args.incidentId, {
      status: args.status,
      resolutionSummary: args.resolutionSummary,
      resolvedAt: args.resolvedAt,
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "incident.status_updated",
      entityType: "incident",
      entityId: args.incidentId,
      metadata: { status: args.status },
    });
    return args.incidentId;
  },
});
