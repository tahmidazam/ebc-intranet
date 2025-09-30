import { getCalendarUrl } from "@/server-actions/get-calendar-url";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import Link from "next/link";

export function CalendarUrlP({
  id,
  className,
  useHttps,
}: {
  id: string;
  className?: string;
  useHttps?: boolean;
}) {
  const { data: url } = useTanStackQuery({
    queryKey: ["calendar-token"],
    queryFn: () => getCalendarUrl(id, false),
  });

  if (!url) return null;

  return (
    <Link className={className} href={url}>
      {useHttps ? url.replace("webcal", "https") : url}
    </Link>
  );
}
