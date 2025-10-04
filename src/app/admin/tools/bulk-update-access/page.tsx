"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { collectionColumns } from "./collection-columns";
import { memberColumns } from "./member-columns";

export default function Page() {
  const collections = useQuery(api.collections.get);
  const members = useQuery(api.user.collectWithCollectionIds);
  const updateAccessToCollectionsForGroup = useMutation(
    api.collectionMembers.updateAccessToCollectionsForGroup
  );

  const [memberRowSelection, setMemberRowSelection] = useState({});
  const [collectionRowSelection, setCollectionRowSelection] = useState({});

  const membersTable = useReactTable({
    data: members ?? [],
    columns: memberColumns,
    onRowSelectionChange: setMemberRowSelection,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: memberRowSelection,
    },
  });

  const collectionsTable = useReactTable({
    data: collections ?? [],
    columns: collectionColumns,
    onRowSelectionChange: setCollectionRowSelection,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: collectionRowSelection,
    },
  });

  if (!collections || !members)
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
              <BreadcrumbItem>Admin</BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>Tools</BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Bulk Update Access</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Button
            className="rounded-full"
            onClick={() => {
              updateAccessToCollectionsForGroup({
                userIds: membersTable
                  .getSelectedRowModel()
                  .rows.map((row) => row.original._id),
                collectionIds: collectionsTable
                  .getSelectedRowModel()
                  .rows.map((row) => row.original._id) as Id<"collections">[],
              });
              membersTable.resetRowSelection();
              collectionsTable.resetRowSelection();
            }}
            disabled={
              membersTable.getSelectedRowModel().rows.length === 0 ||
              collectionsTable.getSelectedRowModel().rows.length === 0
            }
          >
            Update Access
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 overflow-y-scroll">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {membersTable.getHeaderGroups().map((headerGroup) => (
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
            {membersTable.getRowModel().rows?.length ? (
              membersTable.getRowModel().rows.map((row) => (
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
                  colSpan={memberColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {collectionsTable.getHeaderGroups().map((headerGroup) => (
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
            {collectionsTable.getRowModel().rows?.length ? (
              collectionsTable.getRowModel().rows.map((row) => (
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
                  colSpan={collectionColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No collections found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
