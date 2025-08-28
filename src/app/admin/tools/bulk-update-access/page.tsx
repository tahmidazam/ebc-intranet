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
import { useMembers } from "@/hooks/use-members";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function Page() {
  const collections = useQuery(api.collections.get);
  const { data: clerkMembers, isLoading } = useMembers();
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

  const selectableMembers = clerkMembers
    ? clerkMembers.filter((member) => !selectedClerkIds.includes(member.id))
    : [];

  if (!collections || isLoading || !clerkMembers)
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
                clerkIds: selectedClerkIds,
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
                  <SelectItem key={member.id} value={member.id}>
                    {member.fullName}
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
              {selectedClerkIds.map((clerkId) => (
                <TableRow key={clerkId}>
                  <TableCell className="w-full">
                    {
                      clerkMembers.find((member) => member.id === clerkId)
                        ?.fullName
                    }
                  </TableCell>

                  <TableCell
                    className="underline underline-offset-4 decoration-border cursor-pointer"
                    onClick={() => {
                      setSelectedClerkIds((prev) =>
                        prev.filter((id) => id !== clerkId)
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
