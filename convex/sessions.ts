import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const insert = mutation({
    args: {
        timestamp: v.number(),
        duration: v.number(),
        type: v.union(v.literal("water"), v.literal("land")),
        athletes: v.record(v.string(), v.id("users")),
        outline: v.string(),
        collectionId: v.id("collections"),
        boat: v.string(),
        configuration: v.union(v.literal("8+"), v.literal("4+")),
        course: v.string(),
        distance: v.number(),
        coach: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("sessions", {
            timestamp: args.timestamp,
            duration: args.duration,
            type: args.type,
            outline: args.outline,
            collectionId: args.collectionId,
            boat: args.boat,
            configuration: args.configuration,
            course: args.course,
            distance: args.distance,
            coach: args.coach,
            cox: args.athletes["cox"],
            stroke: args.athletes["stroke"],
            seven: args.athletes["7"],
            six: args.athletes["6"],
            five: args.athletes["5"],
            four: args.athletes["4"],
            three: args.athletes["3"],
            two: args.athletes["2"],
            bow: args.athletes["bow"],
        });
    },
});

export const getByCollection = query({
    args: { collectionId: v.id("collections") },
    handler: async (ctx, args) => {
        return await ctx.db.query("sessions")
            .withIndex("collectionId", q => q.eq("collectionId", args.collectionId)).collect();
    }
})

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const seats = ["cox", "stroke", "seven", "six", "five", "four", "three", "two", "bow"] as const;

    const results = await Promise.all(
      seats.map((seat) =>
        ctx.db
          .query("sessions")
          .withIndex(seat, (q) => q.eq(seat, args.userId))
          .collect()
      )
    );

    return results.flat();
  },
});