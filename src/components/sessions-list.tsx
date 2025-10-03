import { abbreviateName } from "@/lib/abbreviate-name";
import { cn } from "@/lib/utils";
import { Event } from "@/schemas/event";
import { SEAT_LABELS } from "@/schemas/seat";
import { useMutation, useQuery } from "convex/react";
import { formatInTimeZone } from "date-fns-tz";
import { Check, CircleCheck, CircleQuestionMark, Eye } from "lucide-react";
import React from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CommentsDrawer } from "./comments-drawer";
import { Button } from "./ui/button";
import { groupEventsByDay } from "@/lib/group-events-by-day";
import { Badge } from "./ui/badge";

export function SessionsList({
  groupedEvents,
  availabilities,
}: {
  groupedEvents: ReturnType<typeof groupEventsByDay>;
  availabilities: Record<string, string>;
}) {
  const user = useQuery(api.user.currentUser);
  const markAsRead = useMutation(api.sessions.markAsRead);

  if (groupedEvents.length === 0) {
    return (
      <div className="pt-24 text-muted-foreground text-center">
        <p>No sessions to display.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {groupedEvents.map((section) => {
        return (
          <div key={section.title} className="flex flex-col first:pt-0 pt-4">
            <div
              className="border-b py-2 px-4 flex items-center justify-between sticky bg-background z-10"
              style={{
                top: "calc(env(safe-area-inset-top) + 100px)",
              }}
            >
              <h2 className="whitespace-nowrap font-semibold text-sm">
                {section.title}
              </h2>

              {availabilities[section.title] && (
                <Badge variant="outline">{availabilities[section.title]}</Badge>
              )}
            </div>

            <div>
              <div className="flex flex-col">
                {section.events.map((event: Event) => (
                  <div
                    key={event.id}
                    className="border-b flex flex-col px-4 py-2 gap-2"
                  >
                    <div>
                      <p className="font-medium">
                        {`${formatInTimeZone(
                          event.start,
                          "Europe/London",
                          "HH:mm"
                        )}–${formatInTimeZone(
                          event.end,
                          "Europe/London",
                          "HH:mm"
                        )} (${event.duration}min)`}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {event.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        {event.boat && (
                          <div>
                            <p className="text-muted-foreground">Boat</p>
                            <p>{event.boat}</p>
                          </div>
                        )}

                        {event.coachName && (
                          <div>
                            <p className="text-muted-foreground">Coach</p>
                            <p>{event.coachName}</p>
                          </div>
                        )}

                        {event.course && event.distance && (
                          <div>
                            <p className="text-muted-foreground">
                              Course & Distance
                            </p>
                            <p>{`${event.course} (${event.distance}km)`}</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 auto-rows-min items-center">
                        {event.seats &&
                          SEAT_LABELS.map((seatLabel) => {
                            const name = event.seats[seatLabel]?.name;
                            const id = event.seats[seatLabel]?.id;
                            if (!name || !id) return null;
                            return (
                              <React.Fragment key={seatLabel}>
                                <p
                                  className={cn(
                                    "text-muted-foreground",
                                    event.userSeat === seatLabel && "italic"
                                  )}
                                >
                                  {seatLabel}
                                </p>
                                <p
                                  className={cn(
                                    event.userSeat === seatLabel &&
                                      "font-medium italic"
                                  )}
                                >
                                  {abbreviateName(name)}
                                </p>

                                {event.read.includes(id) ? (
                                  <CircleCheck className="size-4 text-green-500" />
                                ) : (
                                  <CircleQuestionMark className="size-4 text-muted-foreground" />
                                )}
                              </React.Fragment>
                            );
                          })}
                      </div>
                    </div>

                    {event.outline && event.outline != "" && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Outline</span>
                        <p>{event.outline}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <CommentsDrawer sessionId={event.id as Id<"sessions">} />

                      {user?._id && (
                        <Button
                          variant={
                            event.read.includes(user._id)
                              ? "outline"
                              : "default"
                          }
                          size="icon"
                          className="rounded-full"
                          onClick={() =>
                            markAsRead({
                              id: event.id as Id<"sessions">,
                              existing: event.read,
                            })
                          }
                          disabled={event.read.includes(user._id)}
                        >
                          {event.read.includes(user._id) ? <Check /> : <Eye />}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
