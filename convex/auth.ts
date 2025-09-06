import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";
import { MutationCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
  callbacks: {
    createOrUpdateUser: async (ctx: MutationCtx, args) => {
      if (args.existingUserId) {
        // Optionally merge updated fields into the existing user object here
        return args.existingUserId;
      }

      // Implement your own account linking logic:
      const existingUser = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", args.profile.email!))
        .first();

      if (existingUser) return existingUser._id;

      // Implement your own user creation:
      return await ctx.db.insert("users", {
        email: args.profile.email!,
      });
    },
  },
});
