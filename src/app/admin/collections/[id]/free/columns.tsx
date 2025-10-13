import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  key: string;
  values: string[];
  resolved: string[];
}>[] = [
  {
    header: "Date",
    accessorKey: "key",
  },
  {
    header: "Athletes",
    accessorFn: (row) => row.values.length,
  },
  {
    header: "Resolved",
    accessorFn: (row) => row.resolved.join(", "),
    meta: {
      className: "w-full",
    },
  },
];
