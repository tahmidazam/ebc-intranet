import { cn } from "@/lib/utils";
import { getCalendarUrl } from "@/server-actions/get-calendar-url";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "./ui/button";

export function CalendarUrlP({
  id,
  className,
  useHttps,
  link,
  button,
  clipboardButton,
}: {
  id: string;
  className?: string;
  useHttps?: boolean;
  link?: boolean;
  button?: boolean;
  clipboardButton?: boolean;
}) {
  const { data: url } = useTanStackQuery({
    queryKey: ["calendar-token"],
    queryFn: () => getCalendarUrl(id, false),
  });

  if (!url) return null;

  const resolvedUrl = useHttps ? url.replace("webcal", "https") : url;

  if (clipboardButton)
    return (
      <Button
        variant="outline"
        className={cn("rounded-full", className)}
        onClick={() => navigator.clipboard.writeText(resolvedUrl)}
      >
        Copy Subscription URL
      </Button>
    );

  if (button)
    return (
      <Button
        variant="outline"
        className={cn("rounded-full", className)}
        asChild
      >
        <Link href={resolvedUrl}>Open in Calendar App</Link>
      </Button>
    );

  if (link)
    return (
      <Link className={className} href={url}>
        {resolvedUrl}
      </Link>
    );

  return <p className={className}>{resolvedUrl}</p>;
}
