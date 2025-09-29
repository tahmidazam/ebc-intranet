"use client";

import { getCalendarUrl } from "@/server-actions/get-calendar-url";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const columns: ColumnDef<{
  name: string;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "Calendar URL",
    cell: ({ row }) => {
      return (
        <p
          onClick={async () => {
            const url = await getCalendarUrl(row.original.name, true);
            toast.success(url);
          }}
          className="underline underline-offset-4 decoration-border cursor-pointer"
        >
          Copy Calendar URL
        </p>
      );
    },
    meta: {
      className: "w-full",
    },
  },
];
