"use server";

import { Member } from "@/schemas/member";
import { clerkClient, User } from "@clerk/nextjs/server";

export async function getMembers(): Promise<Member[]> {
  const client = await clerkClient();
  const users = (await client.users.getUserList()).data;
  const members: Member[] = users
    .map((user: User) => {
      if (!user.fullName || !user.primaryEmailAddress) {
        return null;
      }

      const member: Member = {
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.primaryEmailAddress?.emailAddress,
        collectionIds: Array.isArray(user.publicMetadata?.collectionIds)
          ? (user.publicMetadata.collectionIds as string[])
          : [],
      };

      return member;
    })
    .filter((member) => member !== null);

  return members;
}
