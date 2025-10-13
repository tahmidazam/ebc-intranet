interface TimeInterval {
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
}

// Convert time string (HH:MM) to minutes from 00:00
function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0]?.trim() || "0");
  const minutes = parseInt(parts[1]?.trim() || "0");
  return hours * 60 + minutes;
}

// Convert minutes from 00:00 to time string (HH:MM)
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// Parse a single interval string (e.g., "09:00-11:30", "12:00-", "-16:30")
function parseInterval(intervalStr: string): TimeInterval {
  const trimmed = intervalStr.trim();
  const parts = trimmed.split("-");

  let start = 0; // Start of day (00:00)
  let end = 24 * 60; // End of day (24:00 = 1440 minutes)

  if (parts[0]?.trim() !== "") {
    start = timeToMinutes(parts[0]!.trim());
  }

  if (parts[1]?.trim() !== "") {
    end = timeToMinutes(parts[1]!.trim());
  }

  return { start, end };
}

// Parse a comma-separated list of intervals for one person
function parseAvailability(availabilityStr: string): TimeInterval[] {
  const intervals = availabilityStr
    .split(",")
    .map((interval) => interval.trim());
  return intervals.map(parseInterval);
}

// Merge overlapping intervals
function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];

  // Sort intervals by start time
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged: TimeInterval[] = [sorted[0]!];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]!;
    const last = merged[merged.length - 1]!;

    if (current.start <= last.end) {
      // Overlapping intervals, merge them
      last.end = Math.max(last.end, current.end);
    } else {
      // Non-overlapping interval, add it
      merged.push(current);
    }
  }

  return merged;
}

// Convert busy intervals to free intervals for a day
function busyToFree(busyIntervals: TimeInterval[]): TimeInterval[] {
  const merged = mergeIntervals(busyIntervals);
  const freeIntervals: TimeInterval[] = [];

  // Add free time before first busy interval
  if (merged.length > 0 && merged[0]!.start > 0) {
    freeIntervals.push({ start: 0, end: merged[0]!.start });
  }

  // Add free time between busy intervals
  for (let i = 0; i < merged.length - 1; i++) {
    const currentEnd = merged[i]!.end;
    const nextStart = merged[i + 1]!.start;

    if (currentEnd < nextStart) {
      freeIntervals.push({ start: currentEnd, end: nextStart });
    }
  }

  // Add free time after last busy interval
  if (merged.length > 0 && merged[merged.length - 1]!.end < 24 * 60) {
    freeIntervals.push({ start: merged[merged.length - 1]!.end, end: 24 * 60 });
  }

  // If no busy intervals, the whole day is free
  if (merged.length === 0) {
    freeIntervals.push({ start: 0, end: 24 * 60 });
  }

  return freeIntervals;
}

// Find intersection of multiple free interval arrays
function findCommonFreeTime(
  allFreeIntervals: TimeInterval[][]
): TimeInterval[] {
  if (allFreeIntervals.length === 0) return [];
  if (allFreeIntervals.length === 1) return allFreeIntervals[0]!;

  let common = allFreeIntervals[0]!;

  for (let i = 1; i < allFreeIntervals.length; i++) {
    const newCommon: TimeInterval[] = [];
    const currentIntervals = allFreeIntervals[i]!;

    for (const interval1 of common) {
      for (const interval2 of currentIntervals) {
        const start = Math.max(interval1.start, interval2.start);
        const end = Math.min(interval1.end, interval2.end);

        if (start < end) {
          newCommon.push({ start, end });
        }
      }
    }

    common = mergeIntervals(newCommon);
  }

  return common;
}

// Main function that resolves availabilities
export function findFreeIntervals(availabilities: string[]): string[] {
  const allFreeIntervals: TimeInterval[][] = [];

  for (const line of availabilities) {
    const trimmedLine = line.trim().toLowerCase();

    if (trimmedLine === "free") {
      // Person is free the entire day
      allFreeIntervals.push([{ start: 0, end: 24 * 60 }]);
    } else if (trimmedLine === "busy") {
      // Person is busy the entire day
      allFreeIntervals.push([]);
    } else {
      // Parse busy intervals and convert to free intervals
      const busyIntervals = parseAvailability(line);
      const freeIntervals = busyToFree(busyIntervals);
      allFreeIntervals.push(freeIntervals);
    }
  }

  // Find common free times
  const commonFreeTime = findCommonFreeTime(allFreeIntervals);

  // Convert to string array
  return commonFreeTime.map(
    (interval) =>
      `${minutesToTime(interval.start)}-${minutesToTime(interval.end)}`
  );
}
