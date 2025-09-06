"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function Page() {
  const collections = useQuery(api.collections.get);
  const members = useQuery(api.user.collectWithCollectionIds);
  const updateAccessToCollectionsForGroup = useMutation(
    api.collectionMembers.updateAccessToCollectionsForGroup
  );

  const [selectedClerkId, setSelectedClerkId] = useState<string | undefined>(
    undefined
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | undefined
  >(undefined);

  const [selectedClerkIds, setSelectedClerkIds] = useState<string[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    []
  );

  const selectableCollections = collections
    ? collections.filter(
        (collection) => !selectedCollectionIds.includes(collection._id)
      )
    : [];

  const selectableMembers = members
    ? members.filter((member) => !selectedClerkIds.includes(member._id))
    : [];

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
                userIds: selectedClerkIds,
                collectionIds: selectedCollectionIds as Id<"collections">[],
              });
              setSelectedClerkIds([]);
              setSelectedCollectionIds([]);
            }}
            disabled={
              selectedClerkIds.length === 0 ||
              selectedCollectionIds.length === 0
            }
          >
            Update Access
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 pl-2">
            <Select
              value={selectedClerkId}
              onValueChange={setSelectedClerkId}
              disabled={selectableMembers.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Member" />
              </SelectTrigger>
              <SelectContent>
                {selectableMembers.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {formatName(member)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={!selectedClerkId}
              onClick={() => {
                if (selectedClerkId) {
                  setSelectedClerkIds((prev) => [...prev, selectedClerkId]);
                  setSelectedClerkId(undefined);
                }
              }}
            >
              <PlusIcon />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Selected Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedClerkIds.map((userId) => (
                <TableRow key={userId}>
                  <TableCell className="w-full">
                    {(() => {
                      const member = members.find(
                        (member) => member._id === userId
                      );
                      return member ? formatName(member) : null;
                    })()}
                  </TableCell>

                  <TableCell
                    className="underline underline-offset-4 decoration-border cursor-pointer"
                    onClick={() => {
                      setSelectedClerkIds((prev) =>
                        prev.filter((id) => id !== userId)
                      );
                    }}
                  >
                    Remove
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 pr-2">
            <Select
              value={selectedCollectionId}
              onValueChange={setSelectedCollectionId}
              disabled={selectableCollections.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                {selectableCollections.map((collection) => (
                  <SelectItem key={collection._id} value={collection._id}>
                    {collection.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={!selectedCollectionId}
              onClick={() => {
                if (selectedCollectionId) {
                  setSelectedCollectionIds((prev) => [
                    ...prev,
                    selectedCollectionId,
                  ]);
                  setSelectedCollectionId(undefined);
                }
              }}
            >
              <PlusIcon />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Selected Collection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCollectionIds.map((collectionId) => (
                <TableRow key={collectionId}>
                  <TableCell className="w-full">
                    {
                      collections.find(
                        (collection) => collection._id === collectionId
                      )?.title
                    }
                  </TableCell>

                  <TableCell
                    className="underline underline-offset-4 decoration-border cursor-pointer"
                    onClick={() => {
                      setSelectedCollectionIds((prev) =>
                        prev.filter((id) => id !== collectionId)
                      );
                    }}
                  >
                    Remove
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
