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

function sessionsToBusyIntervals(
  sessions: Doc<"sessions">[],
  day: Date
): Interval[] {
  const dayStr = format(day, "EEE MMM d");

  return sessions
    .filter((s) => {
      const sDate = new Date(s.timestamp);
      return format(sDate, "EEE MMM d") === dayStr;
    })
    .map((s) => {
      const sDate = new Date(s.timestamp);
      const start = sDate.getHours() * 60 + sDate.getMinutes();
      const end = start + s.duration;
      return [start, end] as Interval;
    });
}


export function resolveAvailabilities(
  users: Doc<"users">[],
  sessions: Doc<"sessions">[],
  startDate: Date,
  durationMinutes: number
): Doc<"users">[] {
  const dayStr = format(startDate, "EEE MMM d");
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = startMinutes + durationMinutes;

  return users.filter((user) => {
    const avStr = user.availabilities?.[dayStr];
    if (!avStr) return false;

    // Busy from availabilities
    const busyFromAv = parseBusyIntervals(avStr);

    // Busy from sessions (filter only sessions that involve this user)
    const userSessions = sessions.filter(
      (s) =>
        s.cox === user._id ||
        s.stroke === user._id ||
        s.seven === user._id ||
        s.six === user._id ||
        s.five === user._id ||
        s.four === user._id ||
        s.three === user._id ||
        s.two === user._id ||
        s.bow === user._id
    );

    const busyFromSessions = sessionsToBusyIntervals(userSessions, startDate);

    const allBusy = [...busyFromAv, ...busyFromSessions];

    return isIntervalFree(allBusy, startMinutes, endMinutes);
  });
}