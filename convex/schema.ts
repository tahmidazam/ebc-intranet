import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  collections: defineTable({ title: v.string() }),
  links: defineTable({
    url: v.string(),
    label: v.string(),
    collectionId: v.id("collections"),
  }).index("collectionId", ["collectionId"]),
});
