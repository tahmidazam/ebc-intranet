import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()),
    sidePreference: v.optional(
      v.union(
        v.literal("strokeside"),
        v.literal("bowside"),
        v.literal("bisweptual"),
        v.literal("N/A"),
        v.literal("unknown")
      )
    ),
    cox: v.optional(v.boolean()),
    novice: v.optional(v.boolean()),
    availabilities: v.optional(v.record(v.string(), v.string())),
  }).index("email", ["email"]),
  collections: defineTable({
    title: v.string(),
  }),
  links: defineTable({
    title: v.string(),
    url: v.string(),
    collectionId: v.id("collections"),
  }).index("collectionId", ["collectionId"]),
  collectionMembers: defineTable({
    userId: v.string(),
    collectionId: v.id("collections"),
  })
    .index("userId", ["userId"])
    .index("collectionId", ["collectionId"])
    .index("userId_collectionId", ["userId", "collectionId"]),
  sessions: defineTable({
    timestamp: v.number(),
    duration: v.number(),
    type: v.union(v.literal("water"), v.literal("land")),
    outline: v.optional(v.string()),
    collectionId: v.id("collections"),
    boat: v.optional(v.string()),
    configuration: v.union(v.literal("8+"), v.literal("4+")),
    course: v.optional(v.string()),
    distance: v.optional(v.number()),
    coach: v.optional(v.string()),
    cox: v.optional(v.id("users")),
    stroke: v.optional(v.id("users")),
    seven: v.optional(v.id("users")),
    six: v.optional(v.id("users")),
    five: v.optional(v.id("users")),
    four: v.optional(v.id("users")),
    three: v.optional(v.id("users")),
    two: v.optional(v.id("users")),
    bow: v.optional(v.id("users")),
  })
    .index("collectionId", ["collectionId"])
    .index("cox", ["cox"])
    .index("stroke", ["stroke"])
    .index("seven", ["seven"])
    .index("six", ["six"])
    .index("five", ["five"])
    .index("four", ["four"])
    .index("three", ["three"])
    .index("two", ["two"])
    .index("bow", ["bow"]),

});
