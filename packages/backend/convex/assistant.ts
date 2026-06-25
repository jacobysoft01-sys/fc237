import { v } from "convex/values";

import { internalMutation, query } from "./_generated/server";
import { logAuditEvent, now } from "./_shared";

export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user?.activeOrganizationId) return [];

    return (await ctx.db
      .query("chatSessions")
      .withIndex("by_organization", (q) => q.eq("organizationId", user.activeOrganizationId as never))
      .collect()
    ).sort((left, right) => right.updatedAt - left.updatedAt);
  },
});

export const listMessages = query({
  args: { sessionId: v.optional(v.id("chatSessions")) },
  handler: async (ctx, args) => {
    if (!args.sessionId) return [];
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user?.activeOrganizationId) return [];

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.organizationId !== user.activeOrganizationId) return [];

    return (await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId as never))
      .collect()
    ).sort((left, right) => left.timestamp - right.timestamp);
  },
});

export const saveConversationTurn = internalMutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    content: v.string(),
    sessionId: v.optional(v.id("chatSessions")),
    sessionTitle: v.string(),
    assistantText: v.string(),
    detectedIntent: v.string(),
    structuredResponse: v.any(),
    provider: v.string(),
    providerModel: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = now();
    let sessionId = args.sessionId;

    if (sessionId) {
      const existingSession = await ctx.db.get(sessionId);
      if (!existingSession || existingSession.organizationId !== args.organizationId) {
        throw new Error("Assistant session not found");
      }
    } else {
      sessionId = await ctx.db.insert("chatSessions", {
        organizationId: args.organizationId,
        userId: args.userId,
        title: args.sessionTitle,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await ctx.db.insert("chatMessages", {
      sessionId,
      senderType: "user",
      content: args.content,
      detectedIntent: args.detectedIntent,
      timestamp,
    });

    await ctx.db.insert("chatMessages", {
      sessionId,
      senderType: "assistant",
      content: args.assistantText,
      detectedIntent: args.detectedIntent,
      structuredResponse: {
        ...args.structuredResponse,
        provider: args.provider,
        providerModel: args.providerModel,
      },
      timestamp: timestamp + 1,
    });

    await ctx.db.patch(sessionId, {
      updatedAt: timestamp,
      title: args.sessionTitle,
    });

    await logAuditEvent(ctx, {
      organizationId: args.organizationId,
      userId: args.userId,
      action: "assistant.message_sent",
      entityType: "chatSession",
      entityId: sessionId,
      metadata: {
        intent: args.detectedIntent,
        provider: args.provider,
        model: args.providerModel,
      },
    });

    return { sessionId };
  },
});
