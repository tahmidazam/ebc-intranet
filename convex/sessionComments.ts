import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { formatName } from "./formatName";

export const getBySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessionComments")
      .withIndex("sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const postComment = mutation({
  args: {
    sessionId: v.id("sessions"),
    author: v.optional(v.string()),
    content: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    var resolvedAuthor = args.author;

    if (args.userId) {
      const user = await ctx.db.get(args.userId);
      resolvedAuthor = user ? formatName(user) ?? args.author : args.author;
    }

    if (!resolvedAuthor) {
      throw new Error("Author is required");
    }

    return await ctx.db.insert("sessionComments", {
      sessionId: args.sessionId,
      content: args.content,
      timestamp: Date.now(),
      author: resolvedAuthor,
    });
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("sessionComments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);
  },
});
