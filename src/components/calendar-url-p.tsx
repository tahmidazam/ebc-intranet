import { getCalendarUrl } from "@/server-actions/get-calendar-url";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";

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

  return <p className={className}>{url.replaceAll("webcal", "https")}</p>;
}
