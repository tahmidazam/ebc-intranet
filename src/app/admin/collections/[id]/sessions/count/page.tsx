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
import { formatName } from "@/lib/format-name";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { use } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

export default function CountSessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });
  const rows = useQuery(api.sessions.getUserSessionCounts, {
    collectionId: id as Id<"collections">,
  });

  if (!rows || !collection)
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
                <BreadcrumbLink href={`/admin/collections/${id}/sessions`}>
                  Sessions
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Session counts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>Athlete</TableHead>

            <TableHead colSpan={4}>Past</TableHead>

            <TableHead colSpan={4}>Upcoming</TableHead>
          </TableRow>

          <TableRow>
            <TableHead>Water</TableHead>
            <TableHead>Land</TableHead>
            <TableHead>Cancelled</TableHead>
            <TableHead>Total</TableHead>

            <TableHead>Water</TableHead>
            <TableHead>Land</TableHead>
            <TableHead>Cancelled</TableHead>
            <TableHead className="w-full">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map(
            ({
              user,
              pastWater,
              pastLand,
              pastCancelled,
              pastTotal,
              upcomingWater,
              upcomingLand,
              upcomingCancelled,
              upcomingTotal,
            }) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  {formatName(user)}
                </TableCell>

                <TableCell>{pastWater}</TableCell>
                <TableCell>{pastLand}</TableCell>
                <TableCell>{pastCancelled}</TableCell>
                <TableCell>{pastTotal}</TableCell>

                <TableCell>{upcomingWater}</TableCell>
                <TableCell>{upcomingLand}</TableCell>
                <TableCell>{upcomingCancelled}</TableCell>
                <TableCell className="w-full">{upcomingTotal}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </main>
  );
}
