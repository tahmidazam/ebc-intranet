"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
      const url = `https://intranet.emmabc.org/api/cal/coach/${encodeURIComponent(
        row.original.name
      )}`;
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={url}
        >
          {url}
        </Link>
      );
    },
    meta: {
      className: "w-full",
    },
  },
];
