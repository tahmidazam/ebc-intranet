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
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface DeleteSessionsAlertDialogProps {
  children: React.ReactNode;
  sessionIds: Id<"sessions">[];
  onActionComplete: () => void;
}

export function DeleteSessionsAlertDialog({
  children,
  sessionIds,
  onActionComplete,
}: DeleteSessionsAlertDialogProps) {
  const del = useMutation(api.sessions.deleteSessions);
  const handleAction = async () => {
    await del({ ids: sessionIds });
    onActionComplete();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {sessionIds.length} session(s)?
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
