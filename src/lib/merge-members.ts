import { Member } from "@/schemas/member";

export function mergeMembers(
  clerkMembers: Member[] | undefined,
  convexMembers:
    | {
        clerkId: string;
        collectionIds: string[];
      }[]
    | undefined
): Member[] {
  if (!clerkMembers || !convexMembers) return [];

  const convexMap = new Map(convexMembers.map((m) => [m.clerkId, m]));
  const members = clerkMembers.map((m) => ({
    ...m,
    collectionIds: convexMap.get(m.id)?.collectionIds ?? [],
  }));
  return members;
}
