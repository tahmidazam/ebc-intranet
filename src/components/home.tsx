"use client";

import { CollectionsList } from "@/components/collections-list";
import { CommandMenu } from "@/components/command-menu";
import { Preferences } from "@/components/preferences";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useQuery } from "convex/react";
import {
  CalendarSync,
  Loader2Icon,
  LockIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export function Home() {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [showBorder, setShowBorder] = useState(false);
  const user = useQuery(api.user.currentUser);

  useMotionValueEvent(scrollY, "change", (current) => {
    setShowBorder(current > 0);
  });

  if (!collections) {
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
      <div className="fixed top-0 w-full">
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
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" className="rounded-full">
                <Link href={`webcal://localhost:3000/api/cal/${user?._id}`}>
                  <CalendarSync />
                </Link>
              </Button>

              <div
                className={cn(
                  "flex flex-col items-center transition-opacity duration-200"
                )}
              >
                <h1 className="font-medium tracking-tight">EBC Intranet</h1>
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

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <SettingsIcon />
                  </Button>
                </DrawerTrigger>
                <DrawerContent
                  style={{
                    paddingBottom: "env(safe-area-inset-bottom)",
                    height: "calc(100vh - env(safe-area-inset-top))",
                  }}
                >
                  <DrawerHeader className="flex flex-row items-center justify-between">
                    <DrawerTitle className="font-medium text-2xl tracking-tight">
                      Preferences
                    </DrawerTitle>

                    <DrawerClose asChild>
                      <Button
                        className="rounded-full"
                        variant="outline"
                        size="icon"
                      >
                        <XIcon />
                      </Button>
                    </DrawerClose>
                  </DrawerHeader>

                  <Preferences collections={collections} />
                </DrawerContent>
              </Drawer>
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

      <div
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 52px)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left))",
          paddingRight: "env(safe-area-inset-right))",
        }}
        className="min-h-screen"
      >
        <CollectionsList collections={collections} />
      </div>
    </main>
  );
}
