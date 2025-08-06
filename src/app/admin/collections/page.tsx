"use client";

import { NewCollectionSheet } from "@/components/new-collection-sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "convex/react";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";

export default function AdminDashboard() {
  const collections = useQuery(api.collections.get);
  const deleteCollection = useMutation(api.collections.deleteCollection);

  return (
    <div className="h-screen flex flex-col">
      <header className="h-10 px-2 gap-2 sticky top-0 bg-background z-10 border-b flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />

          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Collections</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <NewCollectionSheet />
      </header>
      <section className="flex grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections?.map(({ _id, title }) => (
              <ContextMenu key={_id}>
                <ContextMenuTrigger asChild>
                  <TableRow key={_id}>
                    <TableCell>
                      <Link href={`/admin/collections/${_id}`}>{title}</Link>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() =>
                      deleteCollection({
                        id: _id,
                      })
                    }
                  >
                    <TrashIcon />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
