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

export const updateCollectionAccess = mutation({
  args: {
    clerkId: v.string(),
    collectionIds: v.array(v.id("collections")),
  },
  handler: async (ctx, { clerkId, collectionIds }) => {
    const existingMemberships = await ctx.db
      .query("collectionMembers")
      .withIndex("clerkId", (q) => q.eq("clerkId", clerkId))
      .collect();

    const existingIds = new Set(existingMemberships.map((m) => m.collectionId));
    const desiredIds = new Set(collectionIds);

    for (const collectionId of desiredIds) {
      if (!existingIds.has(collectionId)) {
        await ctx.db.insert("collectionMembers", { clerkId, collectionId });
      }
    }

    for (const membership of existingMemberships) {
      if (!desiredIds.has(membership.collectionId)) {
        await ctx.db.delete(membership._id);
      }
    }
  },
});
