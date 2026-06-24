import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

function filterAndEnrichTasks(
  snapshot: Awaited<ReturnType<typeof loadWorkspaceSnapshot>>,
  args: { status?: string; priority?: string; sourceType?: string },
) {
  const riskById = new Map(snapshot.risks.map((risk) => [String(risk._id), risk]));
  const controlById = new Map(snapshot.controls.map((control) => [String(control._id), control]));
  const evidenceById = new Map(snapshot.evidence.map((evidence) => [String(evidence._id), evidence]));
  const vendorById = new Map(snapshot.vendorEvaluations.map((vendor) => [String(vendor._id), vendor]));
  const incidentById = new Map(snapshot.incidents.map((incident) => [String(incident._id), incident]));
  const policyById = new Map(snapshot.policies.map((policy) => [String(policy._id), policy]));
  const assessmentById = new Map(snapshot.assessments.map((assessment) => [String(assessment._id), assessment]));

  return snapshot.tasks
    .map((task) => ({
      ...task,
      linkedSummary: {
        risk: task.relatedRiskId ? riskById.get(String(task.relatedRiskId)) : null,
        control: task.relatedControlId ? controlById.get(String(task.relatedControlId)) : null,
        evidence: task.relatedEvidenceId ? evidenceById.get(String(task.relatedEvidenceId)) : null,
        vendor: task.relatedVendorEvaluationId ? vendorById.get(String(task.relatedVendorEvaluationId)) : null,
        incident: task.relatedIncidentId ? incidentById.get(String(task.relatedIncidentId)) : null,
        policy: task.relatedPolicyId ? policyById.get(String(task.relatedPolicyId)) : null,
        assessment: task.relatedAssessmentId ? assessmentById.get(String(task.relatedAssessmentId)) : null,
      },
    }))
    .filter((task) => (args.status ? task.status === args.status : true))
    .filter((task) => (args.priority ? task.priority === args.priority : true))
    .filter((task) => (args.sourceType ? task.sourceType === args.sourceType : true))
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate));
}

export const list = query({
  args: {
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    sourceType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    return filterAndEnrichTasks(snapshot, args);
  },
});

export const getActionPlan = query({
  args: {
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    sourceType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return null;
    const snapshot = await loadWorkspaceSnapshot(ctx, active.organization);
    const items = filterAndEnrichTasks(snapshot, args);

    return {
      items,
      filters: {
        priorities: ["critical", "high", "medium", "low"],
        statuses: ["open", "in_progress", "blocked", "done"],
        sourceTypes: Array.from(new Set(snapshot.tasks.map((task) => task.sourceType))).sort(),
      },
      summary: {
        total: snapshot.tasks.length,
        active: snapshot.tasks.filter((task) => !["done", "closed"].includes(task.status)).length,
        critical: snapshot.tasks.filter((task) => task.priority === "critical" && task.status !== "done").length,
      },
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    owner: v.optional(v.string()),
    priority: v.string(),
    dueDate: v.string(),
    sourceType: v.string(),
    sourceId: v.optional(v.string()),
    relatedRiskId: v.optional(v.id("risks")),
    relatedControlId: v.optional(v.id("controls")),
    relatedEvidenceId: v.optional(v.id("evidence")),
    relatedVendorEvaluationId: v.optional(v.id("vendorEvaluations")),
    relatedAssessmentId: v.optional(v.id("assessments")),
    relatedIncidentId: v.optional(v.id("incidents")),
    relatedPolicyId: v.optional(v.id("policies")),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("tasks", {
      organizationId: active.organization._id,
      status: "open",
      createdAt: now(),
      ...args,
    });

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "task.created",
      entityType: "task",
      entityId: id,
      metadata: { title: args.title },
    });
    return id;
  },
});

export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.string(),
    completionNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const task = await ctx.db.get(args.taskId);
    if (!task || task.organizationId !== active.organization._id) throw new Error("Task not found");
    await ctx.db.patch(args.taskId, {
      status: args.status,
      completionNotes: args.completionNotes,
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "task.status_updated",
      entityType: "task",
      entityId: args.taskId,
      metadata: { status: args.status },
    });
    return args.taskId;
  },
});

export const markDone = mutation({
  args: { taskId: v.id("tasks"), completionNotes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const task = await ctx.db.get(args.taskId);
    if (!task || task.organizationId !== active.organization._id) throw new Error("Task not found");
    await ctx.db.patch(args.taskId, { status: "done", completionNotes: args.completionNotes });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "task.completed",
      entityType: "task",
      entityId: args.taskId,
    });
  },
});

export const regenerateGenerated = mutation({
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
      action: "task.generated_regenerated",
      entityType: "organization",
      entityId: active.organization._id,
      metadata: result,
    });
    return result;
  },
});
