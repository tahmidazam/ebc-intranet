import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLinksByCollectionId = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("links")
      .withIndex("collectionId", (q) => q.eq("collectionId", args.collectionId))
      .collect();
  },
});

export const createLink = mutation({
  args: {
    collectionId: v.id("collections"),
    label: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("links", {
      collectionId: args.collectionId,
      label: args.label,
      url: args.url,
    });
  },
});

export const deleteLink = mutation({
  args: { id: v.id("links") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
