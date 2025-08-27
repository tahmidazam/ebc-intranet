"use client";

import { ProfileDialog } from "@/components/profile-dialog";
import { ProfileDrawer } from "@/components/profile-drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Loader2Icon, UserIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";

export function Home() {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [showBorder, setShowBorder] = useState(false);

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

          <ProfileDialog collections={collections}>
            <Button variant="outline" size="icon" className="rounded-full">
              <UserIcon />
            </Button>
          </ProfileDialog>
        </div>

        <div className="flex flex-col">
          {collections.map((collection) => (
            <div key={collection._id} className="flex flex-col first:pt-0 pt-4">
              <h2
                key={collection._id}
                className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm"
              >
                {collection.title}
              </h2>

              {collection.links.map((link) => (
                <Link
                  key={link._id}
                  className="hover:bg-muted/50 border-b py-2 px-4 align-middle whitespace-nowrap"
                  href={link.url}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen">
      <div className="fixed top-0 w-full">
        <nav>
          <div
            className="flex items-center justify-between pb-2 px-4 bg-background/10 backdrop-blur-2xl"
            style={{
              paddingTop: "calc(var(--spacing) * 2 + env(safe-area-inset-top))",
            }}
          >
            <h1 className="font-medium text-2xl tracking-tight">
              EBC Intranet
            </h1>

            <ProfileDrawer collections={collections}>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserIcon />
              </Button>
            </ProfileDrawer>
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
        }}
        className="min-h-screen"
      >
        <div className="flex flex-col">
          {collections.map((collection) => (
            <React.Fragment key={collection._id}>
              <h2
                key={collection._id}
                className="hover:bg-muted/50 border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm"
              >
                {collection.title}
              </h2>

              {collection.links.map((link) => (
                <Link
                  key={link._id}
                  className="hover:bg-muted/50 border-b py-2 px-4 align-middle whitespace-nowrap"
                  href={link.url}
                >
                  {link.title}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
