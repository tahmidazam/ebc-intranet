import { v } from "convex/values";
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
