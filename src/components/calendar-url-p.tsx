import { getCalendarUrl } from "@/server-actions/get-calendar-url";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import Link from "next/link";

export function CalendarUrlP({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { data: url } = useTanStackQuery({
    queryKey: ["calendar-token"],
    queryFn: () => getCalendarUrl(id, false),
  });

  if (!url) return null;

  return (
    <Link className={className} href={url}>
      {url}
    </Link>
  );
}
