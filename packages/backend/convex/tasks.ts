import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("tasks")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    priority: v.string(),
    dueDate: v.string(),
    sourceType: v.string(),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("tasks", {
      organizationId: active.organization._id,
      title: args.title,
      priority: args.priority,
      status: "open",
      dueDate: args.dueDate,
      sourceType: args.sourceType,
      createdAt: now(),
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

export const markDone = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const task = await ctx.db.get(args.taskId);
    if (!task || task.organizationId !== active.organization._id) throw new Error("Task not found");
    await ctx.db.patch(args.taskId, { status: "done" });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "task.completed",
      entityType: "task",
      entityId: args.taskId,
    });
  },
});

