"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation } from "convex/react";
import { useState } from "react";
import z from "zod";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function NewLinkSheet({
  children,
  collectionId,
}: {
  children: React.ReactNode;
  collectionId: string;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const createLink = useMutation(api.links.insert);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLink({
      collectionId: collectionId as Id<"collections">,
      title,
      url,
    });
    setTitle("");
    setUrl("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Link</SheetTitle>
          <SheetDescription>
            Add a link to a resource (e.g., Google Sheets, a website, etc.).
            Ensure your URL begins with <code>https://</code>.
          </SheetDescription>
        </SheetHeader>

        <form
          id="new-link-form"
          onSubmit={handleSubmit}
          className="px-4 flex flex-col gap-4"
        >
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              form="new-link-form"
              type="submit"
              disabled={
                !z.string().nonempty().safeParse(title).success ||
                !z.url().safeParse(url).success
              }
            >
              Add
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
