"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function updateCollectionAccess(
  userId: string,
  collectionIds: string[]
) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      collectionIds,
    },
  });
}
