"use server";

import { Member } from "@/schemas/member";
import { clerkClient, User } from "@clerk/nextjs/server";

export async function getMembers(): Promise<
  Pick<Member, "id" | "fullName" | "emailAddress">[]
> {
  const client = await clerkClient();
  const users = (
    await client.users.getUserList({
      limit: 500,
    })
  ).data;
  const members = users
    .map((user: User) => {
      if (!user.fullName || !user.primaryEmailAddress) return null;

      return {
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.primaryEmailAddress?.emailAddress,
        admin: user.publicMetadata?.role === "admin",
      };
    })
    .filter((member) => member !== null);

  return members;
}
