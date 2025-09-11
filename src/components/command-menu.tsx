"use client";

import { LinkIcon, LockIcon, SearchIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FunctionReturnType } from "convex/server";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

export function CommandMenu({
  collections,
  isAdmin,
}: {
  collections: FunctionReturnType<
    typeof api.collections.getUserCollectionsWithLinks
  >;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {collections
            ?.filter((collection) => collection.links.length > 0)
            ?.map((collection) => (
              <CommandGroup key={collection._id} heading={collection.title}>
                {collection.links.map((link) => (
                  <CommandItem
                    key={link._id}
                    onSelect={() => {
                      window.open(link.url, "_blank", "noopener,noreferrer");
                      setOpen(false);
                    }}
                  >
                    <LinkIcon />
                    <span>{link.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          <CommandSeparator />
          {isAdmin && (
            <CommandGroup heading="Admin">
              <CommandItem
                onSelect={() => {
                  router.push("/admin/members");
                  setOpen(false);
                }}
              >
                <LockIcon />
                <span>Admin Dashboard</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
