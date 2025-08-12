"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

interface DeleteCollectionAlertDialogProps {
  children: React.ReactNode;
  collectionIds: Id<"links">[];
  onActionComplete: () => void;
}

export function DeleteLinkAlertDialog({
  children,
  collectionIds,
  onActionComplete,
}: DeleteCollectionAlertDialogProps) {
  const del = useMutation(api.links.del);
  const handleAction = async () => {
    await del({ ids: collectionIds });
    onActionComplete();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {collectionIds.length} link(s)?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction className="rounded-full" onClick={handleAction}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
