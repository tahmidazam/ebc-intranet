import { getCalendarUrl } from "@/server-actions/get-calendar-url";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import { CalendarSync, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function CalendarSyncButton({ id }: { id: string }) {
  const { data: url } = useTanStackQuery({
    queryKey: ["calendar-token"],
    queryFn: () => getCalendarUrl(id, false),
  });

  if (!url)
    return (
      <Button variant="outline" size="icon" className="rounded-full" disabled>
        <Loader2Icon className="animate-spin" />
      </Button>
    );

  return (
    <Button variant="outline" size="icon" className="rounded-full" asChild>
      <Link href={url}>
        <CalendarSync />
      </Link>
    </Button>
  );
}
