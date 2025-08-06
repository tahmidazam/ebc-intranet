"use client";

import { NewLinkSheet } from "@/components/new-link-sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
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
import { use } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function Page({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = use(params);
  const collection = useQuery(api.collections.getById, {
    id: collectionId as Id<"collections">,
  });
  const links = useQuery(api.links.getLinksByCollectionId, {
    collectionId: collectionId as Id<"collections">,
  });
  const deleteLink = useMutation(api.links.deleteLink);

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
                <BreadcrumbLink href="/admin/collections">
                  Collections
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {collection && collection.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <NewLinkSheet collectionId={collectionId} />
      </header>
      <section className="flex grow overflow-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>label</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links &&
              links.map(({ _id, label, url }) => (
                <ContextMenu key={_id}>
                  <ContextMenuTrigger asChild>
                    <TableRow>
                      <TableCell>{label}</TableCell>
                      <TableCell>
                        <Link href={url}>{url}</Link>
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() =>
                        deleteLink({
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
