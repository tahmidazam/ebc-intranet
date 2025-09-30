import { abbreviateName } from "@/lib/abbreviate-name";
import { cn } from "@/lib/utils";
import { Event } from "@/schemas/event";
import { SEAT_LABELS } from "@/schemas/seat";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";

export function SessionsList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="pt-24 text-muted-foreground text-center">
        <p>No sessions to display.</p>
      </div>
    );
  }

  return (
    <>
      {events.map((event) => {
        return (
          <div key={event.id} className="border-b px-4 py-2">
            <h2 className="">{event.summary}</h2>
            <p className="text-sm text-muted-foreground">
              {`${formatInTimeZone(
                event.start,
                "Europe/London",
                "EEE MMM d"
              )}, ${formatInTimeZone(
                event.start,
                "Europe/London",
                "HH:mm"
              )}–${formatInTimeZone(event.end, "Europe/London", "HH:mm")} (${
                event.duration
              }min)`}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm py-2">
              <div className="flex flex-col gap-1">
                <div>
                  <p className="text-muted-foreground">Boat</p>
                  <p>{event.boat}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Coach</p>
                  <p>{event.coachName}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Course & Distance</p>
                  <p>{`${event.course} (${event.distance}km)`}</p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-x-2">
                {event.seats &&
                  SEAT_LABELS.map((seatLabel, index) => {
                    const name = event.seats[seatLabel];
                    if (!name) return null;
                    return (
                      <React.Fragment key={seatLabel}>
                        <p
                          className={cn(
                            "text-muted-foreground",
                            event.userSeat === seatLabel && "font-medium"
                          )}
                        >
                          {seatLabel}
                        </p>
                        <p
                          className={cn(
                            event.userSeat === seatLabel && "font-medium"
                          )}
                        >
                          {abbreviateName(name)}
                        </p>
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>
            <p>{event.outline}</p>
          </div>
        );
      })}
    </>
  );
}
