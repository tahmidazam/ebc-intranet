"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findFreeIntervals } from "@/lib/find-free";
import { noResultsText } from "@/lib/no-results-text";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { use, useMemo } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { columns } from "./columns";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });
  const users = useQuery(api.user.usersInCollection, {
    collectionId: id as Id<"collections">,
  });

  const days = useMemo(() => {
    if (!users) return [];
    const result = [];
    const today = new Date();
    const monthFromNow = new Date(today);
    monthFromNow.setMonth(today.getMonth() + 1);

    for (
      let d = new Date(today);
      d <= monthFromNow;
      d.setDate(d.getDate() + 1)
    ) {
      const key = format(d, "EEE MMM d");
      const values = users
        .map((user) => user.availabilities?.[key])
        .filter((v) => v !== undefined);
      const resolved = findFreeIntervals(values);
      result.push({
        key,
        values,
        resolved,
      });
    }
    return result;
  }, [users]);

  const table = useReactTable({
    data: days ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!users || !collection)
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
                <BreadcrumbPage>Free Intervals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
