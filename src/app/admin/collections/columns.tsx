"use client";

import EditCollectionAccessSheet from "@/components/sheets/edit-collection-access";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Doc } from "../../../../convex/_generated/dataModel";

export const columns: ColumnDef<Doc<"collections">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "links",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={`/admin/collections/${row.original._id}`}
        >
          Edit Links
        </Link>
      );
    },
  },
  {
    id: "access",
    cell: ({ row }) => {
      return (
        <EditCollectionAccessSheet collectionId={row.original._id}>
          <p className="underline underline-offset-4 decoration-border">
            Edit Access
          </p>
        </EditCollectionAccessSheet>
      );
    },
    meta: {
      className: "w-full",
    },
  },
];
