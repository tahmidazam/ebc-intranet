import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const collectWithCollectionIds = query({
  args: {},
  handler: async (ctx) => {
    // Get all users from Convex Auth
    const users = await ctx.db.query("users").collect();

    // Get all memberships
    const memberships = await ctx.db.query("collectionMembers").collect();

    // Build a lookup: userId -> collectionIds[]
    const byUser: Record<string, string[]> = {};
    for (const m of memberships) {
      if (!byUser[m.userId]) {
        byUser[m.userId] = [];
      }
      byUser[m.userId].push(m.collectionId);
    }

    // Attach collectionIds to each user
    return users.map((user) => ({
      ...user,
      collectionIds: byUser[user._id] ?? [],
    }));
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    admin: v.boolean(),
  },
  handler: async (ctx, { email, firstName, lastName, admin }) => {
    await ctx.db.insert("users", {
      email,
      firstName,
      lastName,
      role: admin ? "admin" : undefined,
    });
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    return user;
  },
});
