"use client";

import { EditCollectionAccessDialog } from "@/components/dialogs/edit-collection-access";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/schemas/member";
import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

export const getColumns = (
  collections: Doc<"collections">[]
): ColumnDef<Member>[] => {
  const collectionMap = new Map(collections.map((col) => [col._id, col]));

  return [
    {
      header: "Full Name",
      accessorKey: "fullName",
    },
    {
      id: "admin",
      cell: (params) => {
        if (!params.row.original.admin) return null;

        return <Badge variant="outline">Admin</Badge>;
      },
    },
    {
      header: "Email",
      accessorKey: "emailAddress",
    },
    {
      header: "Collections",
      id: "collectionIds",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-2">
            {row.original.collectionIds?.map((id) => {
              const title = collectionMap.get(id as Id<"collections">)?.title;

              if (!title) return null;

              return (
                <Badge key={id} variant="outline">
                  {title}
                </Badge>
              );
            }) ?? "None"}
          </div>
        );
      },
      meta: {
        className: "w-full",
      },
    },
    {
      id: "edit",
      cell: ({ row }) => {
        return (
          <EditCollectionAccessDialog member={row.original}>
            <p className="underline-offset-4 underline decoration-border">
              Edit Access
            </p>
          </EditCollectionAccessDialog>
        );
      },
    },
  ];
};
