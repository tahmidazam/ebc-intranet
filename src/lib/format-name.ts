import { Doc } from "../../convex/_generated/dataModel";

export function formatName(user: Doc<"users">): string | undefined {
  if (!user.firstName && !user.lastName) return undefined;

  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}
