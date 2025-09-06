import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserCollectionIds = query({
  handler: async (ctx) => {
    const memberships = await ctx.db.query("collectionMembers").collect();

    const byUser: Record<string, string[]> = {};
    for (const m of memberships) {
      if (!byUser[m.userId]) {
        byUser[m.userId] = [];
      }
      byUser[m.userId].push(m.collectionId);
    }

    return Object.entries(byUser).map(([userId, collectionIds]) => ({
      userId,
      collectionIds,
    }));
  },
});

export const insert = mutation({
  args: {
    userId: v.string(),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, { userId, collectionId }) => {
    await ctx.db.insert("collectionMembers", { userId, collectionId });
  },
});

export const getCollectionUserIds = query({
  args: {
    collectionId: v.id("collections"),
  },
  handler: async (ctx, { collectionId }) => {
    const memberships = await ctx.db
      .query("collectionMembers")
      .withIndex("collectionId", (q) => q.eq("collectionId", collectionId))
      .collect();

    return memberships.map((m) => m.userId);
  },
});

export const updateCollectionAccess = mutation({
  args: {
    collectionId: v.id("collections"),
    userIds: v.array(v.string()),
  },
  handler: async (ctx, { collectionId, userIds }) => {
    const existingMemberships = await ctx.db
      .query("collectionMembers")
      .withIndex("collectionId", (q) => q.eq("collectionId", collectionId))
      .collect();

    const existingIds = new Set(existingMemberships.map((m) => m.userId));
    const desiredIds = new Set(userIds);

    for (const userId of desiredIds) {
      if (!existingIds.has(userId)) {
        await ctx.db.insert("collectionMembers", { userId, collectionId });
      }
    }

    for (const membership of existingMemberships) {
      if (!desiredIds.has(membership.userId)) {
        await ctx.db.delete(membership._id);
      }
    }
  },
});

export const updateAccessToCollectionsForGroup = mutation({
  args: {
    userIds: v.array(v.string()),
    collectionIds: v.array(v.id("collections")),
  },
  handler: async (ctx, { userIds, collectionIds }) => {
    for (const userId of userIds) {
      for (const collectionId of collectionIds) {
        const existing = await ctx.db
          .query("collectionMembers")
          .withIndex("userId_collectionId", (q) =>
            q.eq("userId", userId).eq("collectionId", collectionId)
          )
          .first();

        if (!existing) {
          await ctx.db.insert("collectionMembers", { userId, collectionId });
        }
      }
    }
  },
});
