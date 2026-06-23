import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getCurrentUser, now } from "./_shared";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("knowledgeBaseEntries").collect();
  },
});

export const upsert = mutation({
  args: {
    title: v.string(),
    intent: v.string(),
    category: v.string(),
    content: v.string(),
    recommendedActions: v.array(v.string()),
    evidenceToKeep: v.array(v.string()),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const current = await getCurrentUser(ctx);
    if (!current || !["platformAdmin", "owner", "admin"].includes(current.user.role)) {
      throw new Error("Administrator access required");
    }
    return await ctx.db.insert("knowledgeBaseEntries", {
      ...args,
      version: 1,
      status: "active",
      updatedAt: now(),
    });
  },
});

