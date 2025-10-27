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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { abbreviateName } from "@/lib/abbreviate-name";
import { sessionsToResolvedEvents } from "@/lib/sessions-to-events";
import { cn } from "@/lib/utils";
import { Event } from "@/schemas/event";
import { SEAT_LABELS } from "@/schemas/seat";
import { useQuery } from "convex/react";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { enGB } from "date-fns/locale";
import { CircleCheck, CircleQuestionMark, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { SetStateAction, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { api } from "../../../../convex/_generated/api";
const locales = {
  "en-GB": enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function AdminCalendar() {
  const sessions = useQuery(api.sessions.collect);
  const users = useQuery(api.user.collect);
  const collections = useQuery(api.collections.get);

  const events = useMemo(() => {
    return sessionsToResolvedEvents(
      sessions || [],
      users || [],
      collections || []
    );
  }, [sessions, users, collections]);

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: SetStateAction<Date>) => {
    setDate(newDate);
  };
  const handleViewChange: (view: View) => void = (newView: View) => {
    setView(newView);
  };

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (!sessions || !users || !collections)
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );

  return (
    <main className="w-full flex flex-col h-screen overflow-auto">
      <header className="flex flex-row items-center p-2 justify-between sticky">
        <div className="flex flex-row items-center gap-4">
          <SidebarTrigger variant="outline" className="rounded-full" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="h-full w-full">
        <Calendar
          culture="en-GB"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          titleAccessor="summary"
          popup
          onSelectEvent={setSelectedEvent}
          className="w-full h-full p-4 pt-2"
        />

        <Sheet
          open={selectedEvent !== null}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <SheetContent>
            {selectedEvent && (
              <>
                <SheetHeader>
                  <SheetTitle>{`${formatInTimeZone(
                    selectedEvent.start,
                    "Europe/London",
                    "HH:mm"
                  )}–${formatInTimeZone(
                    selectedEvent.end,
                    "Europe/London",
                    "HH:mm"
                  )} (${selectedEvent.duration}min)`}</SheetTitle>
                  <SheetDescription>{selectedEvent.summary}</SheetDescription>
                </SheetHeader>
                <div
                  key={selectedEvent.id}
                  className="flex flex-col px-4 gap-2"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      {selectedEvent.boat && (
                        <div>
                          <p className="text-muted-foreground">Boat</p>
                          <p>{selectedEvent.boat}</p>
                        </div>
                      )}

                      {selectedEvent.coachName && (
                        <div>
                          <p className="text-muted-foreground">Coach</p>
                          <p>{selectedEvent.coachName}</p>
                        </div>
                      )}

                      {selectedEvent.course && selectedEvent.distance && (
                        <div>
                          <p className="text-muted-foreground">
                            Course & Distance
                          </p>
                          <p>{`${selectedEvent.course} (${selectedEvent.distance}km)`}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 auto-rows-min items-center">
                      {selectedEvent.seats &&
                        SEAT_LABELS.map((seatLabel) => {
                          const name = selectedEvent.seats[seatLabel]?.name;
                          const id = selectedEvent.seats[seatLabel]?.id;
                          if (!name || !id) return null;
                          return (
                            <React.Fragment key={seatLabel}>
                              <p
                                className={cn(
                                  "text-muted-foreground",
                                  selectedEvent.userSeat === seatLabel &&
                                    "italic"
                                )}
                              >
                                {seatLabel}
                              </p>
                              <p
                                className={cn(
                                  selectedEvent.userSeat === seatLabel &&
                                    "font-medium italic"
                                )}
                              >
                                {abbreviateName(name)}
                              </p>

                              {selectedEvent.read.includes(id) ? (
                                <CircleCheck className="size-4 text-green-500" />
                              ) : (
                                <CircleQuestionMark className="size-4 text-muted-foreground" />
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>

                  {selectedEvent.outline && selectedEvent.outline != "" && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Outline</span>
                      <p>{selectedEvent.outline}</p>
                    </div>
                  )}
                </div>

                <SheetFooter>
                  {collections.find(
                    (v) => v.title === selectedEvent.collectionTitle
                  ) && (
                    <Button variant="outline" className="rounded-full">
                      <Link
                        href={`/admin/collections/${
                          collections.find(
                            (v) => v.title === selectedEvent.collectionTitle
                          )?._id
                        }/sessions`}
                      >
                        Go to sessions for {selectedEvent.collectionTitle}
                      </Link>
                    </Button>
                  )}

                  <Button className="rounded-full">
                    <Link
                      href={`/admin/collections/${
                        collections.find(
                          (v) => v.title === selectedEvent.collectionTitle
                        )?._id
                      }/sessions/${selectedEvent.id}/edit`}
                    >
                      Edit Session
                    </Link>
                  </Button>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}
