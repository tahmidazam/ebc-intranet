"use client";

import { CalendarSyncButton } from "@/components/calendar-sync-button";
import { CommandMenu } from "@/components/command-menu";
import { Onboarding } from "@/components/onboarding";
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
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { CalendarIcon, LinkIcon, LockIcon, SettingsIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [showBorder, setShowBorder] = useState(false);
  const user = useQuery(api.user.currentUser);

  useMotionValueEvent(scrollY, "change", (current) => {
    setShowBorder(current > 0);
  });

  if (!isMobile) {
    return (
      <>
        <Authenticated>
          <QueryClientProvider client={queryClient}>
            <main className="max-w-lg mx-auto flex flex-col gap-4">
              <div className="flex justify-between items-center pt-24 px-4">
                <h1 className="font-medium text-2xl tracking-tight">
                  EBC Intranet
                </h1>

                <div className="flex gap-2">
                  {user?._id && <CalendarSyncButton id={user._id} />}

                  {collections && (
                    <CommandMenu
                      collections={collections}
                      isAdmin={user?.role === "admin"}
                    />
                  )}

                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Link href="/admin/collections">
                        <LockIcon />
                      </Link>
                    </Button>
                  )}

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
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

                      {collections && <Preferences collections={collections} />}
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {children}
            </main>
          </QueryClientProvider>
        </Authenticated>
        <Unauthenticated>
          <Onboarding />
        </Unauthenticated>
      </>
    );
  }

  return (
    <>
      <Authenticated>
        <QueryClientProvider client={queryClient}>
          <main className="h-screen">
            <div className="fixed top-0 w-full">
              <nav>
                <div
                  className="flex flex-col pb-2 gap-2 bg-background/10 backdrop-blur-3xl w-full"
                  style={{
                    paddingTop:
                      "calc(var(--spacing) * 2 + env(safe-area-inset-top))",
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
                      <h1 className="font-medium tracking-tight">Links</h1>
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
                </div>

                <Separator
                  className={cn(
                    "transition-opacity duration-200",
                    showBorder ? "opacity-100" : "opacity-0"
                  )}
                />
              </nav>
            </div>

            {children}

            <div
              className="fixed bottom-0 left-0 grid grid-cols-3 w-full bg-background/10 backdrop-blur-3xl border-t pt-2"
              style={{
                paddingBottom:
                  "calc(var(--spacing) * 2 + env(safe-area-inset-bottom))",
              }}
            >
              <div className="flex flex-col items-center text-xs font-medium gap-1">
                <LinkIcon className="size-5" />
                Links
              </div>

              <div className="flex flex-col items-center text-xs font-medium gap-1">
                <CalendarIcon className="size-5" />
                Sessions
              </div>

              <div className="flex flex-col items-center text-xs font-medium gap-1">
                <SettingsIcon className="size-5" />
                Settings
              </div>
            </div>
          </main>
        </QueryClientProvider>
      </Authenticated>
      <Unauthenticated>
        <Onboarding />
      </Unauthenticated>
    </>
  );
}
