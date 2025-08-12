"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { noResultsText } from "@/lib/no-results-text";
import { Member } from "@/schemas/member";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

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
    meta: {
      className: "pl-4",
    },
  },
  {
    header: "Title",
    accessorKey: "title",
    meta: {
      className: "w-full pr-4",
    },
  },
];

export function EditCollectionAccessDialog({
  children,
  member,
}: {
  children: ReactNode;
  member: Member;
}) {
  const collections = useQuery(api.collections.get);
  const updateCollectionAccess = useMutation(
    api.members.updateCollectionAccess
  );

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: collections ?? [],
    columns,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnFilters,
    },
  });

  useEffect(() => {
    if (collections) {
      const selectedRows: Record<string, boolean> = {};
      table.getRowModel().rows.forEach((row) => {
        if (member.collectionIds.includes(row.original._id)) {
          selectedRows[row.id] = true;
        }
      });
      setRowSelection(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 rounded-3xl gap-0">
        <DialogHeader className="p-4">
          <DialogTitle>Edit Collection Access</DialogTitle>
          <DialogDescription>
            Select the collections that {member.fullName} ({member.emailAddress}
            ) can access.
          </DialogDescription>
        </DialogHeader>

        {collections ? (
          <Table className="overflow-auto">
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={header.column.columnDef.meta?.className}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {noResultsText("collections")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Loader2Icon className="animate-spin" />
        )}

        <DialogFooter className="p-4">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="rounded-full"
              onClick={() => {
                updateCollectionAccess({
                  id: member.id,
                  collectionIds: table
                    .getFilteredSelectedRowModel()
                    .rows.map((r) => r.original._id),
                });
                table.resetRowSelection();
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
