"use client";

import { columns } from "@/app/admin/collections/[id]/access/columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { noResultsText } from "@/lib/no-results-text";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });
  const collectionUserIds = useQuery(
    api.collectionMembers.getCollectionUserIds,
    {
      collectionId: id as Id<"collections">,
    }
  );
  const userIds = useQuery(api.collectionMembers.getCollectionUserIds, {
    collectionId: id as Id<"collections">,
  });
  const updateCollectionAccess = useMutation(
    api.collectionMembers.updateCollectionAccess
  );
  const members = useQuery(api.user.collectWithCollectionIds);

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
    if (userIds) {
      const selectedRows: Record<string, boolean> = {};
      table.getRowModel().rows.forEach((row) => {
        if (userIds.includes(row.original._id)) {
          selectedRows[row.id] = true;
        }
      });
      setRowSelection(selectedRows);
    }
  }, [members, userIds, table]);

  const changes = useMemo(() => {
    const setA = new Set(
      table.getSelectedRowModel().rows.map((r) => r.original._id)
    );
    const setB = new Set(collectionUserIds);

    return setA.size !== setB.size || [...setA].some((id) => !setB.has(id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, collectionUserIds, table]);

  if (!members || !collection || !collectionUserIds)
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );

  return (
    <main className="w-full flex flex-col h-screen overflow-auto">
      <header className="flex flex-row items-center p-2 justify-between">
        <div className="flex flex-row items-center gap-4">
          <SidebarTrigger variant="outline" className="rounded-full" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/collections">
                  Collections
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/collections">
                  {collection.title}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Access</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Button
            size="icon"
            className="rounded-full"
            onClick={() => {
              updateCollectionAccess({
                collectionId: id as Id<"collections">,
                userIds: table
                  .getSelectedRowModel()
                  .rows.map((r) => r.original._id),
              });
            }}
            disabled={!changes}
          >
            <SaveIcon />
          </Button>

          <Input
            placeholder="Filter"
            value={
              (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("fullName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded-full"
          />
        </div>
      </header>

      <Table>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  table.getColumn("fullName")?.getFilterValue() as string
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
