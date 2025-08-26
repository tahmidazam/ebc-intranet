"use client";

import { Badge } from "@/components/ui/badge";
import { Member } from "@/schemas/member";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
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
                <Badge key={id} variant="outline" asChild>
                  <Link href={`/admin/collections/${id}`}>{title}</Link>
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
  ];
};
