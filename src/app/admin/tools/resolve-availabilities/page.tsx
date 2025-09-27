"use client";

import { DateTimeSelect } from "@/components/date-time-select";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { resolveAvailabilities } from "@/lib/resolve-availabilities";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { FolderSync, HelpCircle, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";

export default function ResolveAvailabilitiesPage() {
  const collections = useQuery(api.collections.get);
  const allUsers = useQuery(api.user.collectWithCollectionIds);

  const [dateTime, setDateTime] = useState(new Date());
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | undefined
  >(undefined);
  const [duration, setDuration] = useState(90);
  const [view, setView] = useState<"all" | "by-coxes-and-side-preference">(
    "by-coxes-and-side-preference"
  );

  const users = useMemo(() => {
    if (!allUsers || !selectedCollectionId) return [];

    const users = resolveAvailabilities(
      allUsers.filter((user) =>
        user.collectionIds.includes(selectedCollectionId)
      ),
      dateTime,
      duration
    );
    return users;
  }, [allUsers, selectedCollectionId, dateTime, duration]);

  if (!collections || !allUsers)
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
                <BreadcrumbPage>Resolve Availabilities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link href="/admin/tools/sync-members">
              <FolderSync />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <HelpCircle />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Resolve Availabilities Help</SheetTitle>
                <SheetDescription>
                  Figure out who&apos;s available for session planning
                </SheetDescription>

                <div className="flex flex-col gap-4 py-4 text-sm text-pretty">
                  <p>
                    First ensure members have set their availabilities in the
                    Availabilities sheet, and then use the{" "}
                    <Link
                      href="/admin/tools/sync-members"
                      className="underline underline-offset-4 decoration-border"
                    >
                      Sync Members
                    </Link>{" "}
                    tool to update the intranet with the latest information from
                    the sheet.
                  </p>

                  <p>
                    Enter a date, time, and duration, and specify a collection
                    of members to consider. The tool will show you which members
                    are available during that time slot, based on their
                    availabilities.
                  </p>

                  <p>
                    You can view the results either as a single list of all
                    available members, or grouped by cox status and side
                    preference to help with boat assignments.
                  </p>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex justify-start gap-4 px-2 py-4">
        <DateTimeSelect value={dateTime} setValue={setDateTime} />

        <div className="flex flex-col gap-2 w-full">
          <Label>Collection</Label>
          <Select
            value={selectedCollectionId}
            onValueChange={setSelectedCollectionId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection._id} value={collection._id}>
                  {collection.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label>Duration</Label>
          <Select
            value={duration.toString()}
            onValueChange={(value) => setDuration(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30min</SelectItem>
              <SelectItem value="60">60min</SelectItem>
              <SelectItem value="90">90min</SelectItem>
              <SelectItem value="120">2hrs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>View</Label>
          <Select
            value={view}
            onValueChange={(value) =>
              setView(value as "all" | "by-coxes-and-side-preference")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="by-coxes-and-side-preference">
                By Coxes & Side Preference
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === "by-coxes-and-side-preference" && (
        <div className="grid grid-cols-5">
          <ResolvedUsersTable
            users={users.filter((user) => user.cox === true)}
            headerTitle={"Coxes"}
            dateTime={dateTime}
          />
          <ResolvedUsersTable
            users={users.filter(
              (user) =>
                user.cox === false && user.sidePreference === "strokeside"
            )}
            headerTitle="Strokeside"
            dateTime={dateTime}
          />
          <ResolvedUsersTable
            users={users.filter(
              (user) =>
                user.cox === false && user.sidePreference === "bisweptual"
            )}
            headerTitle="Bisweptual"
            dateTime={dateTime}
          />
          <ResolvedUsersTable
            users={users.filter(
              (user) => user.cox === false && user.sidePreference === "bowside"
            )}
            headerTitle="Bowside"
            dateTime={dateTime}
          />
          <ResolvedUsersTable
            users={users.filter(
              (user) =>
                user.cox === false &&
                ((user.sidePreference &&
                  ["N/A", "unknown"].includes(user.sidePreference)) ||
                  !user.sidePreference)
            )}
            headerTitle={"Other (i.e., N/A or unknown)"}
            dateTime={dateTime}
          />
        </div>
      )}

      {view === "all" && (
        <ResolvedUsersTable
          users={users}
          headerTitle={"All"}
          dateTime={dateTime}
        />
      )}
    </main>
  );
}

function ResolvedUsersTable({
  users,
  headerTitle,
  dateTime,
}: {
  users: Doc<"users">[];
  headerTitle: string;
  dateTime: Date;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{headerTitle}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="w-full flex flex-row gap-1 flex-wrap items-center">
              <p>{formatName(user)}</p>
              {user.availabilities?.[format(dateTime, "EEE MMM d")] && (
                <Badge variant="outline">
                  {user.availabilities?.[format(dateTime, "EEE MMM d")]}
                </Badge>
              )}
              {user.novice && <Badge variant="outline">Novice</Badge>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
