"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMembers } from "@/hooks/use-members";
import { mergeMembers } from "@/lib/merge-members";
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
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Loader2Icon } from "lucide-react";

const columns: ColumnDef<Member>[] = [
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
    header: "Full Name",
    accessorKey: "fullName",
    meta: {
      className: "w-full",
    },
  },
];

export default function EditCollectionAccessSheet({
  children,
  collectionId,
}: {
  children: React.ReactNode;
  collectionId: string;
}) {
  const { data: clerkMembers, isLoading } = useMembers();
  const convexMembers = useQuery(api.collectionMembers.getUserCollectionIds);
  const clerkIds = useQuery(api.collectionMembers.getCollectionClerkIds, {
    collectionId: collectionId as Id<"collections">,
  });
  const updateCollectionAccess = useMutation(
    api.collectionMembers.updateCollectionAccess
  );

  const members: Member[] = useMemo(
    () => mergeMembers(clerkMembers, convexMembers),
    [clerkMembers, convexMembers]
  );

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: members ?? [],
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
    if (clerkIds) {
      const selectedRows: Record<string, boolean> = {};
      table.getRowModel().rows.forEach((row) => {
        if (clerkIds.includes(row.original.id)) {
          selectedRows[row.id] = true;
        }
      });
      setRowSelection(selectedRows);
    }
  }, [clerkIds, table]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Collection Access</SheetTitle>
          <SheetDescription>
            Change the members who can access this collection and its links.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="px-4">
              <Input
                placeholder="Filter"
                value={
                  (table.getColumn("fullName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("fullName")
                    ?.setFilterValue(event.target.value)
                }
                className="rounded-full shrink-0"
              />
            </div>

            <Table className="overflow-y-scroll">
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
                      {noResultsText(
                        "members",
                        (table
                          .getColumn("fullName")
                          ?.getFilterValue() as string) ?? ""
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button
              className="rounded-full"
              onClick={() => {
                updateCollectionAccess({
                  collectionId: collectionId as Id<"collections">,
                  clerkIds: table
                    .getSelectedRowModel()
                    .rows.map((r) => r.original.id),
                });
              }}
            >
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
