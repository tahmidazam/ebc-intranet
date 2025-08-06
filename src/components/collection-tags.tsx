"use client";

import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function CollectionBadge({ collectionId }: { collectionId: string }) {
  const collection = useQuery(api.collections.getById, {
    id: collectionId as Id<"collections">,
  });

  if (!collection) {
    return null;
  }

  return <Badge variant="secondary">{collection.title}</Badge>;
}
