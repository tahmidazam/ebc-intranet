import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => ctx.db.query("collections").collect(),
});

export const insert = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("collections", { title: args.title });
  },
});

export const del = mutation({
  args: { ids: v.array(v.id("collections")) },
  handler: async (ctx, { ids }) => {
    await Promise.all(ids.map((id) => ctx.db.delete(id)));
  },
});

export const getById = query({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserCollectionsWithLinks = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const memberships = await ctx.db
      .query("collectionMembers")
      .withIndex("clerkId", (q) => q.eq("clerkId", identity.subject))
      .collect();

    if (memberships.length === 0) return [];

    const collectionIds = memberships.map((m) => m.collectionId);

    const collections = await Promise.all(
      collectionIds.map((id) => ctx.db.get(id))
    );
    const validCollections = collections.filter((c) => c !== null);

    const linksByCollectionId: Record<string, Doc<"links">[]> = {};
    for (const collectionId of collectionIds) {
      const links = await ctx.db
        .query("links")
        .withIndex("collectionId", (q) => q.eq("collectionId", collectionId))
        .collect();
      linksByCollectionId[collectionId] = links;
    }

    return validCollections.map((collection) => ({
      ...collection,
      links: linksByCollectionId[collection._id] ?? [],
    }));
  },
});
