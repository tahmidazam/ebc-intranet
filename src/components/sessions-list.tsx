import { abbreviateName } from "@/lib/abbreviate-name";
import { cn } from "@/lib/utils";
import { Event } from "@/schemas/event";
import { SEAT_LABELS } from "@/schemas/seat";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { CommentsDrawer } from "./comments-drawer";

export function SessionsList({
  events,
  availabilities,
}: {
  events: Event[];
  availabilities: Record<string, string>;
}) {
  if (events.length === 0) {
    return (
      <div className="pt-24 text-muted-foreground text-center">
        <p>No sessions to display.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {events.map((event: Event) => (
        <div key={event.id} className="border-b flex flex-col px-4 py-2 gap-2">
          <div>
            <p className="font-medium">
              {`${formatInTimeZone(
                event.start,
                "Europe/London",
                "EEE MMM d"
              )} ${formatInTimeZone(
                event.start,
                "Europe/London",
                "HH:mm"
              )}–${formatInTimeZone(event.end, "Europe/London", "HH:mm")} (${
                event.duration
              }min)`}
            </p>

            <p className="text-sm text-muted-foreground">{event.summary}</p>
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
                  <p className="text-muted-foreground">Course & Distance</p>
                  <p>{`${event.course} (${event.distance}km)`}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-2 auto-rows-min">
              {event.seats &&
                SEAT_LABELS.map((seatLabel) => {
                  const name = event.seats[seatLabel];
                  if (!name) return null;
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
                          event.userSeat === seatLabel && "font-medium italic"
                        )}
                      >
                        {abbreviateName(name)}
                      </p>
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
          </div>
        </div>
      ))}
    </div>
  );
}
