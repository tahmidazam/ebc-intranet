import { Event } from "@/schemas/event";
import { formatInTimeZone } from "date-fns-tz";

export function groupEventsByDay(
  events: Event[],
  descending = false
): {
  title: string; // formatted day (EEE MMM d)
  events: Event[];
}[] {
  const factor = descending ? -1 : 1;

  // Sort by time first (ascending or descending)
  const sorted = [...events].sort(
    (a, b) => factor * (a.start.getTime() - b.start.getTime())
  );

  // Group by day key (ISO string for stable grouping)
  const grouped = sorted.reduce<Record<string, Event[]>>((acc, event) => {
    const isoKey = event.start.toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (!acc[isoKey]) acc[isoKey] = [];
    acc[isoKey].push(event);
    return acc;
  }, {});

  // Build sections with formatted titles, ordering days asc/desc based on flag
  return Object.keys(grouped)
    .sort((a, b) => factor * (new Date(a).getTime() - new Date(b).getTime()))
    .map((isoKey) => ({
      title: formatInTimeZone(new Date(isoKey), "Europe/London", "EEE MMM d"),
      events: grouped[isoKey],
    }));
}
