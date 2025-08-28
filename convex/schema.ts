import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  collections: defineTable({
    title: v.string(),
  }),
  links: defineTable({
    title: v.string(),
    url: v.string(),
    collectionId: v.id("collections"),
  }).index("collectionId", ["collectionId"]),
  collectionMembers: defineTable({
    clerkId: v.string(),
    collectionId: v.id("collections"),
  })
    .index("clerkId", ["clerkId"])
    .index("collectionId", ["collectionId"])
    .index("clerkId_collectionId", ["clerkId", "collectionId"]),
});
