import { format } from "date-fns";
import { Doc } from "../../convex/_generated/dataModel";

type Interval = [number, number];

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function parseBusyIntervals(avStr: string): Interval[] {
  if (!avStr) return [];
  if (avStr === "free") return [];
  if (avStr === "busy") return [[0, 24 * 60]];

  return avStr.split(",").map((range) => {
    range = range.trim();

    // "-HH:MM" → busy from midnight to that time
    if (range.startsWith("-")) {
      const end = parseTimeToMinutes(range.slice(1));
      return [0, end] as Interval;
    }

    // "HH:MM-" → busy from that time to midnight
    if (range.endsWith("-")) {
      const start = parseTimeToMinutes(range.slice(0, -1));
      return [start, 24 * 60] as Interval;
    }

    // "HH:MM-HH:MM" → busy between those times
    const [startStr, endStr] = range.split(/[-–]/).map((s) => s.trim());
    const start = parseTimeToMinutes(startStr);
    const end = parseTimeToMinutes(endStr);
    return [start, end] as Interval;
  });
}

function isIntervalFree(busy: Interval[], start: number, end: number): boolean {
  return busy.every(([bStart, bEnd]) => end <= bStart || start >= bEnd);
}

export function resolveAvailabilities(
  users: Doc<"users">[],
  startDate: Date,
  durationMinutes: number
): Doc<"users">[] {
  const dayStr = format(startDate, "EEE MMM d");
  console.log("Checking availabilities for", dayStr);
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = startMinutes + durationMinutes;

  return users.filter((user) => {
    const avStr = user.availabilities?.[dayStr];
    if (!avStr) return false;

    const busyIntervals = parseBusyIntervals(avStr);
    console.log(
      `User ${user.firstName} ${user.lastName} busy intervals:`,
      busyIntervals
    );
    return isIntervalFree(busyIntervals, startMinutes, endMinutes);
  });
}
