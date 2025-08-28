"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Doc } from "../../../../../../convex/_generated/dataModel";

export const columns: ColumnDef<Doc<"links">>[] = [
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
    id: "url",
    header: "URL",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={row.original.url}
        >
          {row.original.url}
        </Link>
      );
    },
    meta: {
      className: "w-full",
    },
  },
];
