import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInYears,
  format,
} from "date-fns";

export function formatRelativeDate(date: Date, now: Date = new Date()): string {
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  const years = differenceInYears(now, date);

  // < 1 min
  if (minutes < 1) return "1m";

  // < 1 hour
  if (minutes < 60) return `${minutes}m`;

  // < 1 day
  if (hours < 24) return `${hours}h`;

  // < 7 days
  if (days < 7) return `${days}d`;

  // < 1 year
  if (years < 1) return format(date, "MMM d");

  // ≥ 1 year
  return format(date, "MMM d, yyyy");
}