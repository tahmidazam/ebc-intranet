"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { capitalise } from "@/lib/capitalise";
import { formatName } from "@/lib/format-name";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import React from "react";
import { CircleCheck, CircleQuestionMark } from "lucide-react";

export const getColumns = (
  users: Doc<"users">[],
  collectionId: Id<"collections">
): ColumnDef<Doc<"sessions">>[] => [
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));
      return (
        <Link href={`/admin/sessions/${row.original._id}`}>
          {format(date, "EEE MMM d, HH:mm")}
        </Link>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as string;
      return `${duration} min`;
    },
  },
  {
    accessorKey: "configuration",
    header: "Config.",
  },
  {
    accessorKey: "boat",
    header: "Boat",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "coach",
    header: "Coach",
  },
  {
    id: "seats",
    header: "Seats",
    cell: ({ row }) => {
      const seatOrder = [
        "cox",
        "stroke",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "bow",
      ] as const;

      const seatPropMap: Record<
        (typeof seatOrder)[number],
        keyof typeof row.original
      > = {
        cox: "cox",
        stroke: "stroke",
        "7": "seven",
        "6": "six",
        "5": "five",
        "4": "four",
        "3": "three",
        "2": "two",
        bow: "bow",
      };

      const seats = {
        cox: users.find((u) => u._id === row.original.cox),
        stroke: users.find((u) => u._id === row.original.stroke),
        "7": users.find((u) => u._id === row.original.seven),
        "6": users.find((u) => u._id === row.original.six),
        "5": users.find((u) => u._id === row.original.five),
        "4": users.find((u) => u._id === row.original.four),
        "3": users.find((u) => u._id === row.original.three),
        "2": users.find((u) => u._id === row.original.two),
        bow: users.find((u) => u._id === row.original.bow),
      };

      return (
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 auto-rows-min items-center">
          {seatOrder.map((seat) => {
            const user = seats[seat];
            if (!user) return null;
            const seatId = row.original[seatPropMap[seat]];
            return (
              <React.Fragment key={seat}>
                <p className="text-muted-foreground">{capitalise(seat)}</p>
                <p>{formatName(user)}</p>
                {seatId &&
                typeof seatId === "string" &&
                row.original.read?.includes(seatId) ? (
                  <CircleCheck className="size-4 text-green-500" />
                ) : (
                  <CircleQuestionMark className="size-4 text-muted-foreground" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "outline",
    header: "Outline",
    meta: {
      className: "w-full whitespace-normal break-words",
    },
  },
  {
    id: "comments",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={`/admin/collections/${collectionId}/sessions/${row.original._id}/comments`}
        >
          View Comments
        </Link>
      );
    },
  },
  {
    id: "edit",
    cell: ({ row }) => {
      return (
        <Link
          className="underline underline-offset-4 decoration-border"
          href={`/admin/collections/${collectionId}/sessions/${row.original._id}/edit`}
        >
          Edit
        </Link>
      );
    },
    meta: {
      className: "w-full",
    },
  },
];
