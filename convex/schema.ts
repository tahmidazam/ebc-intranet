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
});
