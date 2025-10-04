"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatName } from "@/lib/format-name";
import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../../convex/_generated/dataModel";

export const memberColumns: ColumnDef<Doc<"users">>[] = [
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
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      return <div>{formatName(row.original)}</div>;
    },
    meta: {
      className: "w-full",
    },
  },
];
