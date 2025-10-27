import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const collect = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").collect();
  },
});

export const insert = mutation({
  args: {
    timestamp: v.number(),
    duration: v.number(),
    type: v.union(v.literal("water"), v.literal("land")),
    athletes: v.record(v.string(), v.id("users")),
    outline: v.optional(v.string()),
    collectionId: v.id("collections"),
    boat: v.optional(v.string()),
    configuration: v.union(v.literal("8+"), v.literal("4+")),
    course: v.optional(v.string()),
    distance: v.optional(v.number()),
    coach: v.optional(v.string()),
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
    return await ctx.db
      .query("sessions")
      .withIndex("collectionId", (q) => q.eq("collectionId", args.collectionId))
      .collect();
  },
});

export const getByCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const seats = [
      "cox",
      "stroke",
      "seven",
      "six",
      "five",
      "four",
      "three",
      "two",
      "bow",
    ] as const;
    type Seat = (typeof seats)[number];

    const results = await (
      await Promise.all(
        seats.map((seat) =>
          ctx.db
            .query("sessions")
            .withIndex(seat, (q) => q.eq(seat, userId))
            .collect()
        )
      )
    ).flat();

    const { userIds, collectionIds } = results.reduce(
      (acc, session) => {
        // Add all crew members to userIds set
        seats.forEach((key) => {
          if (session[key]) acc.userIds.add(session[key]);
        });

        // Add collection ID
        acc.collectionIds.add(session.collectionId);

        return acc;
      },
      {
        userIds: new Set<string>(),
        collectionIds: new Set<string>(),
      }
    );

    // Batch fetch all required data
    const [usersArray, collectionsArray] = await Promise.all([
      Promise.all(
        Array.from(userIds).map((uid) => ctx.db.get(uid as Id<"users">))
      ),
      Promise.all(
        Array.from(collectionIds).map((cid) =>
          ctx.db.get(cid as Id<"collections">)
        )
      ),
    ]);

    return {
      sessions: results,
      users: usersArray.filter((u): u is Doc<"users"> => u !== null),
      collections: collectionsArray.filter(
        (c): c is Doc<"collections"> => c !== null
      ),
    };
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const seats = [
      "cox",
      "stroke",
      "seven",
      "six",
      "five",
      "four",
      "three",
      "two",
      "bow",
    ] as const;

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

export const getByCoach = query({
  args: { coach: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("coach", (q) => q.eq("coach", args.coach))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("sessions"),
    type: v.union(v.literal("water"), v.literal("land")),
    outline: v.optional(v.string()),
    boat: v.optional(v.string()),
    course: v.optional(v.string()),
    distance: v.optional(v.number()),
    coach: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      type: args.type,
      outline: args.outline,
      boat: args.boat,
      course: args.course,
      distance: args.distance,
      coach: args.coach,
    });
  },
});

export const deleteSessions = mutation({
  args: { ids: v.array(v.id("sessions")) },
  handler: async (ctx, args) => {
    await Promise.all(args.ids.map((sessionId) => ctx.db.delete(sessionId)));
  },
});

export const markAsRead = mutation({
  args: { id: v.id("sessions"), existing: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(args.id, {
      read: [...args.existing, userId],
    });
  },
});
