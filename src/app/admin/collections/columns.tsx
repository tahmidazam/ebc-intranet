"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "sonner";
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
          href={`/admin/collections/${row.original._id}/links`}
        >
          Edit Links
        </Link>
      );
    },
  },
  {
    id: "sessions",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={`/admin/collections/${row.original._id}/sessions`}
        >
          Edit Sessions
        </Link>
      );
    },
  },
  {
    id: "access",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={`/admin/collections/${row.original._id}/access`}
        >
          Edit Access
        </Link>
      );
    },
  },
  {
    id: "free",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={`/admin/collections/${row.original._id}/free`}
        >
          View Free Intervals
        </Link>
      );
    },
  },
  {
    id: "calendar",
    cell: ({ row }) => {
      return (
        <p
          className="underline underline-offset-4 decoration-border"
          onClick={() => {
            toast.success(
              `webcal://intranet.emmabc.org/api/cal/collection/${row.original._id}`
            );
          }}
        >
          Get Calendar Link
        </p>
      );
    },
    meta: {
      className: "w-full",
    },
  },
];
