import { Event } from "@/schemas/event";
import { formatInTimeZone } from "date-fns-tz";

export function groupEventsByDay(events: Event[]): {
  title: string; // formatted day (EEE MMM d)
  events: Event[];
}[] {
  // Sort by time first
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  // Group by day key (ISO string for stable grouping)
  const grouped = sorted.reduce<Record<string, Event[]>>((acc, event) => {
    const isoKey = event.start.toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (!acc[isoKey]) acc[isoKey] = [];
    acc[isoKey].push(event);
    return acc;
  }, {});

  // Build sections with formatted titles
  return Object.keys(grouped)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((isoKey) => ({
      title: formatInTimeZone(new Date(isoKey), "Europe/London", "EEE MMM d"),
      events: grouped[isoKey]
    }));
}