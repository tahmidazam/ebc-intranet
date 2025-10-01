import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    author: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessionComments", {
      sessionId: args.sessionId,
      content: args.content,
      timestamp: Date.now(),
      author: args.author,
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
