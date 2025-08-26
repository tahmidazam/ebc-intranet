"use client";

import { ProfileDialog } from "@/components/profile-dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { Loader2Icon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "../../convex/_generated/api";

export function Home() {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);

  if (!collections) {
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center pt-24 px-2">
        <h1 className="text-2xl tracking-tight font-semibold">EBC Intranet</h1>

        <ProfileDialog collections={collections}>
          <Button variant="outline" size="icon" className="rounded-full">
            <UserIcon />
          </Button>
        </ProfileDialog>
      </div>

      <div className="flex flex-col">
        {collections.map((collection) => (
          <React.Fragment key={collection._id}>
            <h2
              key={collection._id}
              className="hover:bg-muted/50 border-b p-2 align-middle whitespace-nowrap font-semibold"
            >
              {collection.title}
            </h2>

            {collection.links.map((link) => (
              <Link
                key={link._id}
                className="hover:bg-muted/50 border-b p-2 align-middle whitespace-nowrap"
                href={link.url}
              >
                {link.title}
              </Link>
            ))}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}
