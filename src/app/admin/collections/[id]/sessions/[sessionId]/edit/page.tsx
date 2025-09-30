"use client";

import { CoachSelect } from "@/components/coach-select";
import { CourseAndDistanceSelect } from "@/components/course-and-distance-select";
import { SessionTypeSelect } from "@/components/session-type-select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { capitalise } from "@/lib/capitalise";
import { BOATS } from "@/schemas/boat";
import { useMutation, useQuery } from "convex/react";
import { formatInTimeZone } from "date-fns-tz";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../convex/_generated/dataModel";

export default function EditSession({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { id, sessionId } = use(params);

  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });
  const session = useQuery(api.sessions.getById, {
    id: sessionId as Id<"sessions">,
  });
  const updateSession = useMutation(api.sessions.update);

  const [type, setType] = useState<"water" | "land">("water");
  const [boat, setBoat] = useState<string | undefined>(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [course, setCourse] = useState<string | undefined>(undefined);
  const [coach, setCoach] = useState<string | undefined>(undefined);
  const [outline, setOutline] = useState("");

  useEffect(() => {
    if (!session) return;

    setType(session.type);
    setBoat(session.boat);
    setDistance(session.distance);
    setCourse(session.course);
    setCoach(session.coach);
    if (session.outline) setOutline(session.outline);
  }, [session]);

  const router = useRouter();

  if (!session || !collection)
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
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <Button
            size="icon"
            className="rounded-full"
            onClick={async () => {
              await updateSession({
                id: session._id,
                type,
                boat,
                course,
                distance,
                coach,
                outline,
              });

              router.push(`/admin/collections/${id}/sessions`);
            }}
          >
            <SaveIcon />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8 p-4 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-4 text-sm text-muted-foreground text-pretty">
          <p>
            Only parameters of a session that does not affect availability can
            be changed after creation. To change the date, time, duration or
            athletes of a session, it must be deleted and re-created.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SessionTypeSelect value={type} onValueChange={setType} />

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="boat">Boat</Label>
            <Select
              value={boat}
              onValueChange={(value) => {
                if (value === "undefined") {
                  setBoat(undefined);
                } else {
                  const selectedBoat = BOATS.find((b) => b.name === value);
                  if (selectedBoat) {
                    setBoat(selectedBoat.name);
                  }
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select boat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undefined">No boat</SelectItem>
                {BOATS.filter(
                  (item) => item.configuration === session.configuration
                ).map((boatOption) => (
                  <SelectItem key={boatOption.name} value={boatOption.name}>
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

          <CoachSelect coach={coach} setCoach={setCoach} />

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
      </div>
    </main>
  );
}
