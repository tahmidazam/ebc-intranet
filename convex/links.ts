import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => ctx.db.query("links").collect(),
});

export const getByCollectionId = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("links")
      .withIndex("collectionId", (q) => q.eq("collectionId", args.collectionId))
      .collect();
  },
});

export const insert = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("links", {
      title: args.title,
      url: args.url,
      collectionId: args.collectionId,
    });
  },
});

export const del = mutation({
  args: { ids: v.array(v.id("links")) },
  handler: async (ctx, { ids }) => {
    await Promise.all(ids.map((id) => ctx.db.delete(id)));
  },
});
