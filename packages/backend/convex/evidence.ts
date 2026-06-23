import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertRole, getActiveOrganization, logAuditEvent, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return [];
    return await ctx.db
      .query("evidence")
      .withIndex("by_organization", (q) => q.eq("organizationId", active.organization._id))
      .collect();
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getActiveOrganization(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    evidenceType: v.string(),
    controlId: v.optional(v.id("controls")),
    fileStorageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    status: v.string(),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant", "member"]);
    const id = await ctx.db.insert("evidence", {
      organizationId: active.organization._id,
      title: args.title,
      evidenceType: args.evidenceType,
      controlId: args.controlId,
      fileStorageId: args.fileStorageId,
      fileName: args.fileName,
      status: args.status,
      reviewNotes: args.reviewNotes,
      uploadedBy: active.user._id,
      uploadedAt: now(),
    });
    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "evidence.created",
      entityType: "evidence",
      entityId: id,
      metadata: { title: args.title, status: args.status },
    });
    return id;
  },
});

