"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const collections = useQuery(api.collections.getCollectionsWithLinks);

  if (!collections) {
    return <Loader2Icon className="animate-spin" />;
  }

  return (
    <div>
      <header className="sticky top-0 bg-background z-10 border-b px-4 py-2 flex justify-between items-center">
        <h1 className="font-medium text-center">EBC Intranet</h1>

        <SignOutButton>
          <Button variant="outline" size="icon" className="rounded-full">
            <LogOutIcon />
          </Button>
        </SignOutButton>
      </header>
      <div className="flex flex-col">
        {collections.map((collection) => (
          <div key={collection._id} className="flex flex-col">
            <h2 className="font-medium px-4 py-2 border-b">
              {collection.title}
            </h2>
            {collection.links.map((link) => (
              <Link
                key={link._id}
                href={link.url}
                className="pl-8 pr-4 py-2 border-b"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
