"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { updateCollectionAccess } from "@/actions/update-collection-access";
import { Member } from "@/schemas/member";

export function EditCollectionAccessDialog({
  children,
  member,
  onSave,
}: {
  children: React.ReactNode;
  member: Member;
  onSave: () => void;
}) {
  const collections = useQuery(api.collections.get);
  const [newCollectionIds, setNewCollectionIds] = React.useState<string[]>(
    member.collectionIds ?? []
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Collection Access</DialogTitle>
          <DialogDescription>
            Select the collections that {member.fullName} ({member.emailAddress}
            ) can access.
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections?.map(({ _id, title }) => (
              <TableRow key={_id}>
                <TableCell className="w-8">
                  <Checkbox
                    checked={newCollectionIds.includes(_id)}
                    onCheckedChange={() => {
                      if (newCollectionIds.includes(_id)) {
                        setNewCollectionIds(
                          newCollectionIds.filter((id) => id !== _id)
                        );
                      } else {
                        setNewCollectionIds([...newCollectionIds, _id]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                updateCollectionAccess(member.id, newCollectionIds);
                onSave();
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
