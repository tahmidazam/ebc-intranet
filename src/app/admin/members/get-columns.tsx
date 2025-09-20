"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatName } from "@/lib/format-name";
import { Checkbox } from "@/components/ui/checkbox";

export const getColumns = (
  collections: Doc<"collections">[]
): ColumnDef<Doc<"users"> & { collectionIds: string[] }>[] => {
  const collectionMap = new Map(collections.map((col) => [col._id, col]));

  return [
    {
      header: "Full Name",
      id: "fullName",
      accessorFn: (row) => formatName(row),
    },
    {
      id: "admin",
      cell: (params) => {
        if (params.row.original.role !== "admin") return null;

        return <Badge variant="outline">Admin</Badge>;
      },
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Side Preference",
      accessorKey: "sidePreference",
      cell: (params) => {
        if (!params.row.original.sidePreference) return null;

        return (
          <Badge variant="outline">{params.row.original.sidePreference}</Badge>
        );
      },
    },
    {
      header: "Cox",
      accessorKey: "cox",
      cell: (params) => {
        return <Checkbox checked={params.row.original.cox} />;
      },
    },
    {
      header: "Novice",
      accessorKey: "novice",
      cell: (params) => {
        return <Checkbox checked={params.row.original.novice} />;
      },
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
