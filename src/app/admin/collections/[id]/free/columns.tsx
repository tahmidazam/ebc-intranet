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
    header: "Resolved",
    accessorFn: (row) => row.resolved.join(", "),
    meta: {
      className: "w-full",
    },
  },
];
