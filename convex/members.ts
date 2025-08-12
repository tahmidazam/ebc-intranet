import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => ctx.db.query("members").collect(),
});

export const updateCollectionAccess = mutation({
  args: {
    id: v.string(),
    collectionIds: v.array(v.id("collections")),
  },
  handler: async (ctx, args) => {
    const { id, collectionIds } = args;

    const existingUser = await ctx.db
      .query("members")
      .withIndex("clerkId", (q) => q.eq("clerkId", id))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        collectionIds,
      });
    } else {
      await ctx.db.insert("members", {
        clerkId: id,
        collectionIds,
      });
    }
  },
});
