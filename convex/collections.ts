import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("collections").collect();
  },
});

export const getById = query({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("collections", { title: args.title });
  },
});

export const deleteCollection = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getCollectionsWithLinks = query({
  args: {},
  handler: async (ctx, args) => {
    const collections = await ctx.db.query("collections").collect();
    const results = await Promise.all(
      collections.map(async (collection) => {
        const links = await ctx.db
          .query("links")
          .withIndex("collectionId", (q) =>
            q.eq("collectionId", collection._id)
          )
          .collect();

        return {
          ...collection,
          links,
        };
      })
    );
    return results;
  },
});
