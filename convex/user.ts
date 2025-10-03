import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const collect = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateEventOffset = mutation({
  args: {
    eventOffset: v.optional(v.number()),
  },
  handler: async (ctx, { eventOffset }) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, { eventOffset });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const usersInCollection = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, { collectionId }) => {
    const memberships = await ctx.db
      .query("collectionMembers")
      .withIndex("collectionId", (q) => q.eq("collectionId", collectionId))
      .collect();

    const userIds = memberships.map((m) => m.userId as Id<"users">);
    if (userIds.length === 0) return [];

    // Batch fetch users for efficiency and filter out nulls
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    return users.filter((u): u is NonNullable<typeof u> => !!u);
  },
});

export const collectWithCollectionIds = query({
  args: {},
  handler: async (ctx) => {
    // Get all users from Convex Auth
    const users = await ctx.db.query("users").collect();

    // Get all memberships
    const memberships = await ctx.db.query("collectionMembers").collect();

    // Build a lookup: userId -> collectionIds[]
    const byUser: Record<string, string[]> = {};
    for (const m of memberships) {
      if (!byUser[m.userId]) {
        byUser[m.userId] = [];
      }
      byUser[m.userId].push(m.collectionId);
    }

    // Attach collectionIds to each user
    return users.map((user) => ({
      ...user,
      collectionIds: byUser[user._id] ?? [],
    }));
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    admin: v.boolean(),
  },
  handler: async (ctx, { email, firstName, lastName, admin }) => {
    await ctx.db.insert("users", {
      email,
      firstName,
      lastName,
      role: admin ? "admin" : undefined,
    });
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const tryGetById = query({
  args: { id: v.optional(v.string()) },
  handler: async (ctx, { id }) => {
    if (!id) return null;
    return await ctx.db.get(id as Id<"users">);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    return user;
  },
});

export const syncSheetMembers = mutation({
  args: {
    members: v.array(
      v.object({
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        sidePreference: v.union(
          v.literal("strokeside"),
          v.literal("bowside"),
          v.literal("bisweptual"),
          v.literal("N/A"),
          v.literal("unknown")
        ),
        cox: v.boolean(),
        novice: v.boolean(),
        availabilities: v.record(v.string(), v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const member of args.members) {
      const existing = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", member.email))
        .unique();

      if (existing) {
        // Build only the fields that differ
        const updates: Partial<typeof existing> = {};

        if (existing.sidePreference !== member.sidePreference) {
          updates.sidePreference = member.sidePreference;
        }
        if (existing.cox !== member.cox) {
          updates.cox = member.cox;
        }
        if (existing.novice !== member.novice) {
          updates.novice = member.novice;
        }
        // Shallow compare availabilities:
        if (
          JSON.stringify(existing.availabilities ?? {}) !==
          JSON.stringify(member.availabilities)
        ) {
          updates.availabilities = member.availabilities;
        }

        // Only patch if something changed
        if (Object.keys(updates).length > 0) {
          await ctx.db.patch(existing._id, updates);
        }
      } else {
        // Insert new
        await ctx.db.insert("users", {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          sidePreference: member.sidePreference,
          cox: member.cox,
          novice: member.novice,
          availabilities: member.availabilities,
        });
      }
    }
  },
});
