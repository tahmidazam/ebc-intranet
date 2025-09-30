"use client";

import { CoachSelect } from "@/components/coach-select";
import { CourseAndDistanceSelect } from "@/components/course-and-distance-select";
import { DateTimeSelect } from "@/components/date-time-select";
import { SessionTypeSelect } from "@/components/session-type-select";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { formatName } from "@/lib/format-name";
import { resolveAvailabilities } from "@/lib/resolve-availabilities";
import { cn } from "@/lib/utils";
import { BOATS } from "@/schemas/boat";
import { COURSE_CASES } from "@/schemas/course";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { FolderSync, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";
import z from "zod";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";

const SEAT_CASES = ["cox", "stroke", "7", "6", "5", "4", "3", "2", "bow"];
export default function ResolveAvailabilitiesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const collections = useQuery(api.collections.get);
  const allUsers = useQuery(api.user.usersInCollection, {
    collectionId: id as Id<"collections">,
  });
  const sessions = useQuery(api.sessions.getByCollection, {
    collectionId: id as Id<"collections">,
  });
  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });

  const insertSession = useMutation(api.sessions.insert);

  const [dateTime, setDateTime] = useState(new Date());

  const [duration, setDuration] = useState(90);
  const [view, setView] = useState<"all" | "by-coxes-and-side-preference">(
    "by-coxes-and-side-preference"
  );
  const [outline, setOutline] = useState("");
  const [type, setType] = useState<"water" | "land">("water");
  const [configuration, setConfiguration] = useState<"8+" | "4+">("8+");
  const [boat, setBoat] = useState<string | undefined>(BOATS[0].name);
  const [athletes, setAthletes] = useState<Record<string, Id<"users">>>({});
  const [distance, setDistance] = useState<number | undefined>(
    COURSE_CASES[0].distance
  );
  const [course, setCourse] = useState<string | undefined>(
    COURSE_CASES[0].label
  );
  const [coach, setCoach] = useState<string | undefined>(undefined);

  const users = useMemo(() => {
    if (!allUsers || !sessions) return [];

    const users = resolveAvailabilities(allUsers, sessions, dateTime, duration);
    return users;
  }, [allUsers, dateTime, duration, sessions]);

  if (!collections || !allUsers || !sessions || !collection)
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
                <BreadcrumbPage>New</BreadcrumbPage>
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

          <Button
            className="rounded-full"
            onClick={() => {
              const dto = {
                timestamp: dateTime.getTime(),
                duration,
                type,
                outline,
                collectionId: id as Id<"collections">,
                boat,
                configuration,
                course,
                distance,
                coach,
                athletes,
              };

              const schema = z.object({
                timestamp: z.number(),
                duration: z.number(),
                type: z.enum(["water", "land"]),
                outline: z.string(),
                collectionId: z.string(),
                boat: z.string().optional(),
                configuration: z.enum(["8+", "4+"]),
                course: z.string(),
                distance: z.number(),
                coach: z.string().optional(),
                athletes: z.record(z.string(), z.string()),
              });

              const parsed = schema.safeParse(dto);

              if (!parsed.success) {
                toast.error(z.prettifyError(parsed.error));
                return;
              }

              insertSession(dto);
              toast.success("Session added");
              setAthletes({});
            }}
          >
            Add Session
          </Button>
        </div>
      </header>

      <PanelGroup direction="vertical">
        <Panel maxSize={75}>
          <div className="flex justify-start gap-4 px-2 py-4">
            <DateTimeSelect value={dateTime} setValue={setDateTime} />

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
                configuration={configuration}
                athletes={athletes}
                setAthletes={setAthletes}
              />
              <ResolvedUsersTable
                users={users.filter(
                  (user) =>
                    user.cox === false && user.sidePreference === "strokeside"
                )}
                headerTitle="Strokeside"
                athletes={athletes}
                dateTime={dateTime}
                configuration={configuration}
                setAthletes={setAthletes}
              />
              <ResolvedUsersTable
                users={users.filter(
                  (user) =>
                    user.cox === false && user.sidePreference === "bisweptual"
                )}
                headerTitle="Bisweptual"
                athletes={athletes}
                dateTime={dateTime}
                configuration={configuration}
                setAthletes={setAthletes}
              />
              <ResolvedUsersTable
                users={users.filter(
                  (user) =>
                    user.cox === false && user.sidePreference === "bowside"
                )}
                headerTitle="Bowside"
                athletes={athletes}
                dateTime={dateTime}
                configuration={configuration}
                setAthletes={setAthletes}
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
                athletes={athletes}
                dateTime={dateTime}
                configuration={configuration}
                setAthletes={setAthletes}
              />
            </div>
          )}

          {view === "all" && (
            <ResolvedUsersTable
              users={users}
              headerTitle={"All"}
              athletes={athletes}
              dateTime={dateTime}
              setAthletes={setAthletes}
              configuration={configuration}
            />
          )}
        </Panel>

        <PanelResizeHandle className="h-0.5 bg-accent" />

        <Panel maxSize={75}>
          <PanelGroup direction="horizontal">
            <Panel>
              <div className="flex flex-col p-2 gap-4 h-full">
                <div className="flex flex-row gap-4">
                  <SessionTypeSelect value={type} onValueChange={setType} />

                  <div className="flex flex-col gap-2 w-full">
                    <Label htmlFor="boat">Boat</Label>
                    <Select
                      value={boat}
                      onValueChange={(value) => {
                        if (value === "undefined") {
                          setBoat(undefined);
                          setConfiguration("8+");
                        } else {
                          const selectedBoat = BOATS.find(
                            (b) => b.name === value
                          );
                          if (selectedBoat) {
                            setBoat(selectedBoat.name);
                            setConfiguration(
                              selectedBoat.configuration as "8+" | "4+"
                            );
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select boat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undefined">No boat</SelectItem>
                        {BOATS.map((boatOption) => (
                          <SelectItem
                            key={boatOption.name}
                            value={boatOption.name}
                          >
                            {boatOption.name} ({boatOption.configuration})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <CourseAndDistanceSelect
                    course={course}
                    setCourse={setCourse}
                    setDistance={setDistance}
                  />
                </div>

                <div className="flex flex-col gap-2 w-full flex-1">
                  <Label htmlFor="outline">Outline</Label>
                  <Textarea
                    id="outline"
                    placeholder="Outline"
                    className="rounded-2xl h-full resize-none"
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                  />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-0.5 bg-accent" />

            <Panel>
              <div className="flex flex-col gap-4 pt-2 h-full">
                <div className="flex flex-row gap-4 px-2">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Configuration</Label>
                    <Select
                      value={configuration}
                      onValueChange={(value) =>
                        setConfiguration(value as "8+" | "4+")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8+">8+</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <CoachSelect coach={coach} setCoach={setCoach} />
                </div>

                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>Seat</TableHead>
                      <TableHead>Athlete</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SEAT_CASES.filter(
                      (seat) =>
                        configuration === "8+" ||
                        !["4", "5", "6", "7"].includes(seat)
                    ).map((seat) => (
                      <TableRow key={seat}>
                        <TableCell className="">
                          {seat.charAt(0).toUpperCase() + seat.slice(1)}
                        </TableCell>

                        <TableCell
                          className={cn(
                            "w-full",
                            !athletes[seat] && "text-muted-foreground"
                          )}
                        >
                          {athletes[seat]
                            ? (() => {
                                const athlete = allUsers.find(
                                  (user) => user._id === athletes[seat]
                                );
                                return athlete
                                  ? formatName(athlete)
                                  : "Unassigned";
                              })()
                            : "Unassigned"}
                        </TableCell>

                        <TableCell
                          className="cursor-pointer underline underline-offset-4 decoration-border"
                          onClick={() => {
                            setAthletes((prev) => {
                              const updated = { ...prev };
                              delete updated[seat];
                              return updated;
                            });
                          }}
                        >
                          Remove
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </main>
  );
}

function ResolvedUsersTable({
  users,
  headerTitle,
  dateTime,
  athletes,
  setAthletes,
  configuration,
}: {
  users: Doc<"users">[];
  headerTitle: string;
  dateTime: Date;
  athletes: Record<string, Id<"users">>;
  setAthletes: React.Dispatch<
    React.SetStateAction<Record<string, Id<"users">>>
  >;
  configuration: "8+" | "4+";
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
            <TableCell className="w-full flex flex-row justify-between items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-full flex flex-row gap-1 flex-wrap items-center cursor-pointer">
                    <p
                      className={cn(
                        Object.values(athletes).includes(user._id)
                          ? "text-muted-foreground italic"
                          : undefined
                      )}
                    >
                      {formatName(user)}
                    </p>
                    {user.availabilities?.[format(dateTime, "EEE MMM d")] && (
                      <Badge variant="outline">
                        {user.availabilities?.[format(dateTime, "EEE MMM d")]}
                      </Badge>
                    )}
                    {user.novice && <Badge variant="outline">Novice</Badge>}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Assign {formatName(user)}&apos;s Seat
                  </DropdownMenuLabel>
                  {SEAT_CASES.filter(
                    (seat) =>
                      (configuration === "8+" ||
                        !["4", "5", "6", "7"].includes(seat)) &&
                      !athletes[seat]
                  ).map((seat) => (
                    <DropdownMenuItem
                      key={seat}
                      onClick={() =>
                        setAthletes((prev) => {
                          const updated = Object.fromEntries(
                            Object.entries(prev).filter(
                              ([, id]) => id !== user._id
                            )
                          );
                          updated[seat] = user._id;
                          return updated;
                        })
                      }
                    >
                      {seat.charAt(0).toUpperCase() + seat.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
