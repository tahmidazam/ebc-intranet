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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { api } from "../../convex/_generated/api";

const titleSchema = z.string().nonempty();

export function NewCollectionSheet() {
  const [title, setTitle] = useState("");
  const createCollection = useMutation(api.collections.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCollection({ title });
    setTitle("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="size-7">
          <PlusIcon />
          <span className="sr-only">Add Collection</span>
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Collection</SheetTitle>
          <SheetDescription>
            A collection represents a set of links that can be added to a group
            together.
          </SheetDescription>
        </SheetHeader>

        <form id="new-collection-form" onSubmit={handleSubmit} className="px-4">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Collection Title"
            />
          </div>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              form="new-collection-form"
              type="submit"
              disabled={!titleSchema.safeParse(title).success}
            >
              Add
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
