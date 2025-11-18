"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { capitalise } from "@/lib/capitalise";
import { formatName } from "@/lib/format-name";
import { cn } from "@/lib/utils";
import { SEAT_KEYS } from "@/schemas/seat";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation, useQuery } from "convex/react";
import { formatInTimeZone } from "date-fns-tz";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { api } from "../../../../../../../../../convex/_generated/api";
import {
  Doc,
  Id,
} from "../../../../../../../../../convex/_generated/dataModel";

export default function SwapPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string; seat: string }>;
}) {
  const router = useRouter();

  const { id, sessionId, seat } = use(params);

  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });
  const session = useQuery(api.sessions.getById, {
    id: sessionId as Id<"sessions">,
  });
  const swapSeat = useMutation(api.sessions.swapSeat);
  const users = useQuery(api.user.collect);

  const [selectedUserId, setSelectedUserId] =
    React.useState<Id<"users"> | null>(null);

  const userToSwap =
    session &&
    users?.find((u) => u._id === session[seat as keyof typeof session]);

  if (!session || !collection || !users || !userToSwap)
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
                <BreadcrumbLink href={`/admin/collections/${id}/sessions`}>
                  {formatInTimeZone(
                    new Date(session.timestamp),
                    "Europe/London",
                    "EEE MMM d, HH:mm"
                  )}{" "}
                  {capitalise(session.type)} Session
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Make Substitution</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8 p-4 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-4 text-sm text-muted-foreground text-pretty">
          <p>
            Ensure you are confident the individual you are swapping in is
            available. No checks are performed to verify availability.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid w-full max-w-xs items-center gap-2">
            <Label htmlFor="url">Swap {formatName(userToSwap)} with:</Label>
            <UserCombobox
              users={users}
              userId={selectedUserId}
              setUserId={setSelectedUserId}
            />
          </div>

          <Button
            className="rounded-full"
            disabled={
              !selectedUserId ||
              !SEAT_KEYS.includes(seat as (typeof SEAT_KEYS)[number])
            }
            onClick={() => {
              swapSeat({
                userId: selectedUserId!,
                seat: seat as (typeof SEAT_KEYS)[number],
                sessionId: sessionId as Id<"sessions">,
              });

              router.push(`/admin/collections/${id}/sessions`);
            }}
          >
            Confirm Substitution
          </Button>
        </div>
      </div>
    </main>
  );
}

export function UserCombobox({
  users,
  userId,
  setUserId,
}: {
  users: Doc<"users">[];
  userId: Id<"users"> | null;
  setUserId: (user: Id<"users"> | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] shrink-0 justify-between rounded-full"
        >
          {userId && users.find((user) => user._id === userId)
            ? formatName(users.find((user) => user._id === userId)!)
            : "Select substitution..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] shrink-0 p-0">
        <Command>
          <CommandInput placeholder="Search users..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user._id}
                  value={user._id}
                  keywords={[user.firstName, user.lastName, user.email].filter(
                    (i) => i !== undefined
                  )}
                  onSelect={(currentValue) => {
                    setUserId(
                      currentValue === userId
                        ? null
                        : (currentValue as Id<"users">)
                    );
                    setOpen(false);
                  }}
                >
                  {formatName(user)}
                  <Check
                    className={cn(
                      "ml-auto",
                      userId === user._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
