"use client";

import { CollectionsList } from "@/components/collections-list";
import { ProfileDialog } from "@/components/profile-dialog";
import { ProfileDrawer } from "@/components/profile-drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2Icon, LockIcon, UserIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export function Home() {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [showBorder, setShowBorder] = useState(false);
  const { user } = useUser();

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
            {user?.publicMetadata.role === "admin" && (
              <Button variant="outline" size="icon" className="rounded-full">
                <Link href="/admin/collections">
                  <LockIcon />
                </Link>
              </Button>
            )}

            <ProfileDialog collections={collections}>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserIcon />
              </Button>
            </ProfileDialog>
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
            className="flex items-center justify-between pb-2 bg-background/10 backdrop-blur-2xl"
            style={{
              paddingTop: "calc(var(--spacing) * 2 + env(safe-area-inset-top))",
              paddingLeft:
                "calc(var(--spacing) * 4 + env(safe-area-inset-left))",
              paddingRight:
                "calc(var(--spacing) * 4 + env(safe-area-inset-right))",
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
