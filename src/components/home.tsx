"use client";

import { CollectionsList } from "@/components/collections-list";
import { CommandMenu } from "@/components/command-menu";
import { Preferences } from "@/components/preferences";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { capitalise } from "@/lib/capitalise";
import { sessionsToResolvedEvents } from "@/lib/sessions-to-events";
import { useIntranetStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Loader2Icon, LockIcon, SettingsIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { api } from "../../convex/_generated/api";
import { CalendarSyncButton } from "./calendar-sync-button";
import { SessionsList } from "./sessions-list";
import { TabBar } from "./tab-bar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function Home() {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [showBorder, setShowBorder] = useState(false);
  const user = useQuery(api.user.currentUser);
  const tab = useIntranetStore(useShallow((state) => state.tab));
  const sessionsToDisplay = useIntranetStore(
    useShallow((state) => state.sessionsToDisplay)
  );
  const setSessionsToDisplay = useIntranetStore(
    useShallow((state) => state.setSessionsToDisplay)
  );

  useMotionValueEvent(scrollY, "change", (current) => {
    setShowBorder(current > 0);
  });

  const queryResult = useQuery(api.sessions.getByCurrentUser);

  const events = useMemo(() => {
    if (!queryResult || !user) return null;
    const events = sessionsToResolvedEvents(
      queryResult.sessions,
      queryResult.users,
      queryResult.collections,
      user._id
    ).sort((a, b) => a.start.getTime() - b.start.getTime());

    const now = new Date();
    if (sessionsToDisplay === "upcoming") {
      return events.filter((event) => event.end > now);
    } else {
      return events.filter((event) => event.end <= now);
    }
  }, [queryResult, user, sessionsToDisplay]);

  if (!collections || !user || !events) {
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );
  }

  if (!isMobile) {
    return (
      <main className="max-w-lg mx-auto flex flex-col gap-4">
        <div className="flex justify-between items-center pt-24 px-4">
          <h1 className="font-medium text-2xl tracking-tight">EBC Intranet</h1>

          <div className="flex gap-2">
            <CalendarSyncButton id={user?._id} />

            <CommandMenu
              collections={collections}
              isAdmin={user?.role === "admin"}
            />

            {user?.role === "admin" && (
              <Button variant="outline" size="icon" className="rounded-full">
                <Link href="/admin/collections">
                  <LockIcon />
                </Link>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <SettingsIcon />
                </Button>
              </SheetTrigger>

              <SheetContent className="gap-0">
                <SheetHeader>
                  <SheetTitle>Preferences</SheetTitle>
                  <SheetDescription className="sr-only">
                    Manage your profile and view preferences.
                  </SheetDescription>
                </SheetHeader>

                <Preferences collections={collections} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <CollectionsList collections={collections} />
      </main>
    );
  }

  return (
    <main className="h-screen">
      <div className="fixed top-0 w-full z-20">
        <nav>
          <div
            className="flex flex-col pb-2 gap-2 bg-background/10 backdrop-blur-3xl w-full"
            style={{
              paddingTop: "calc(var(--spacing) * 2 + env(safe-area-inset-top))",
              paddingLeft:
                "calc(var(--spacing) * 4 + env(safe-area-inset-left))",
              paddingRight:
                "calc(var(--spacing) * 4 + env(safe-area-inset-right))",
            }}
          >
            <div className="flex items-center justify-center">
              <div
                className={cn(
                  "flex flex-col items-center transition-opacity duration-200"
                )}
              >
                <h1 className="font-medium tracking-tight">
                  {capitalise(tab)}
                </h1>
                <p className="text-muted-foreground text-xs">
                  {[
                    user?.email.split("@")[0],
                    user?.sidePreference
                      ? capitalise(user.sidePreference)
                      : undefined,
                    user?.cox ? "cox" : undefined,
                    user?.role === "admin" ? "Admin" : undefined,
                  ]
                    .filter((item) => item != undefined)
                    .join(" · ")}
                </p>
              </div>
            </div>

            {tab === "sessions" && (
              <Tabs
                defaultValue="upcoming"
                value={sessionsToDisplay}
                onValueChange={(value) =>
                  setSessionsToDisplay(value as "upcoming" | "past")
                }
                className="w-full"
              >
                <TabsList className="w-full flex">
                  <TabsTrigger value="upcoming" className="flex-1 w-full">
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1 w-full">
                    Past
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <Separator
            className={cn(
              "transition-opacity duration-200",
              showBorder ? "opacity-100" : "opacity-0"
            )}
          />
        </nav>
      </div>

      <div
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 56px ${
            tab === "sessions" ? "+ 44px" : ""
          })`,
          paddingBottom:
            "calc(env(safe-area-inset-bottom) + 56px + var(--spacing) * 8)",
          paddingLeft: "env(safe-area-inset-left))",
          paddingRight: "env(safe-area-inset-right))",
        }}
        className="min-h-screen"
      >
        {tab === "links" && <CollectionsList collections={collections} />}

        {tab === "sessions" && (
          <SessionsList
            events={events}
            availabilities={user.availabilities ?? {}}
          />
        )}

        {tab === "settings" && <Preferences collections={collections} />}
      </div>

      <TabBar />
    </main>
  );
}
