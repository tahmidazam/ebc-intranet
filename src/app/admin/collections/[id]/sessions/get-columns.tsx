"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { capitalise } from "@/lib/capitalise";
import { formatName } from "@/lib/format-name";

export const getColumns = (
  users: Doc<"users">[]
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
        <div className="flex flex-col ">
          {seatOrder.map((seat) => {
            const user = seats[seat];
            if (!user) return null;
            return (
              <div key={seat} className="flex flex-row justify-between">
                <p className="text-muted-foreground pr-8">{capitalise(seat)}</p>
                <p>{formatName(user)}</p>
              </div>
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
      className: "w-full",
    },
  },
];
