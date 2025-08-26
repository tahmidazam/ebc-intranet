import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserCollectionIds = query({
  handler: async (ctx) => {
    const memberships = await ctx.db.query("collectionMembers").collect();

    const byUser: Record<string, string[]> = {};
    for (const m of memberships) {
      if (!byUser[m.clerkId]) {
        byUser[m.clerkId] = [];
      }
      byUser[m.clerkId].push(m.collectionId);
    }

    return Object.entries(byUser).map(([clerkId, collectionIds]) => ({
      clerkId,
      collectionIds,
    }));
  },
});

export const getCollectionClerkIds = query({
  args: {
    collectionId: v.id("collections"),
  },
  handler: async (ctx, { collectionId }) => {
    const memberships = await ctx.db
      .query("collectionMembers")
      .withIndex("collectionId", (q) => q.eq("collectionId", collectionId))
      .collect();

    return memberships.map((m) => m.clerkId);
  },
});

export const updateCollectionAccess = mutation({
  args: {
    collectionId: v.id("collections"),
    clerkIds: v.array(v.string()),
  },
  handler: async (ctx, { collectionId, clerkIds }) => {
    const existingMemberships = await ctx.db
      .query("collectionMembers")
      .withIndex("collectionId", (q) => q.eq("collectionId", collectionId))
      .collect();

    const existingIds = new Set(existingMemberships.map((m) => m.clerkId));
    const desiredIds = new Set(clerkIds);

    for (const clerkId of desiredIds) {
      if (!existingIds.has(clerkId)) {
        await ctx.db.insert("collectionMembers", { clerkId, collectionId });
      }
    }

    for (const membership of existingMemberships) {
      if (!desiredIds.has(membership.clerkId)) {
        await ctx.db.delete(membership._id);
      }
    }
  },
});
