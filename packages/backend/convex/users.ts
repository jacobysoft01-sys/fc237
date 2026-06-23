import { mutation, query } from "./_generated/server";
import { ensureUser, getCurrentUser } from "./_shared";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const current = await getCurrentUser(ctx);
    return current?.user ?? null;
  },
});

export const upsertCurrent = mutation({
  args: {},
  handler: async (ctx) => {
    const current = await ensureUser(ctx);
    return current.user;
  },
});

