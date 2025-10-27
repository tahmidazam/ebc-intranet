"use client";

import { sessionsToICalEventData } from "@/lib/sessions-to-ical-event-data";
import { useQuery } from "convex/react";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enGB } from "date-fns/locale";
import { Loader2Icon } from "lucide-react";
import { SetStateAction, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { api } from "../../../../convex/_generated/api";
const locales = {
  "en-GB": enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminCalendar() {
  const sessions = useQuery(api.sessions.collect);
  const users = useQuery(api.user.collect);
  const collections = useQuery(api.collections.get);

  const events = useMemo(() => {
    return sessionsToICalEventData({
      sessions: sessions || [],
      users: users || [],
      collections: collections || [],
    });
  }, [sessions, users, collections]);

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: SetStateAction<Date>) => {
    setDate(newDate);
  };
  const handleViewChange: (view: View) => void = (newView: View) => {
    setView(newView);
  };

  console.log(events);

  if (!sessions || !users || !collections)
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );

  return (
    <div className="h-screen w-full">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        titleAccessor="summary"
        popup
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
