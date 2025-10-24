import { formatName } from "@/lib/format-name";
import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

export const getColumns = (
  users: Doc<"users">[]
): ColumnDef<{
  key: string;
  values: string[];
  resolved: string[];
  userIds: Id<"users">[];
}>[] => {
  return [
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
      accessorFn: (row) =>
        row.resolved.length > 0
          ? row.resolved.join(", ")
          : "No common free time",
    },
    {
      header: "Missing",
      accessorFn: (row) => {
        const missingUsers = users.filter(
          (user) => !row.userIds.includes(user._id)
        );

        if (missingUsers.length === 0) {
          return "None";
        }
        return missingUsers.map((user) => formatName(user)).join(", ");
      },
      meta: {
        className: "w-full",
      },
    },
  ];
};
