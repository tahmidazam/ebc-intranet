import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const provisionToken = mutation({
  args: { id: v.string(), coach: v.boolean(), token: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("calendarTokens")
      .withIndex("id_coach", (q) => q.eq("id", args.id).eq("coach", args.coach))
      .first();

    if (existing) {
      return existing.token;
    }

    await ctx.db.insert("calendarTokens", {
      id: args.id,
      coach: args.coach,
      token: args.token,
    });

    return args.token;
  },
});

export const resolveToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("calendarTokens").withIndex("token", q => q.eq("token", args.token)).first();
    }
});