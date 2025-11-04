"use client";

import { CommentsList } from "@/components/comments-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { capitalise } from "@/lib/capitalise";
import { useQuery } from "convex/react";
import { formatInTimeZone } from "date-fns-tz";
import { Loader2Icon } from "lucide-react";
import { use } from "react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../convex/_generated/dataModel";

export default function EditSession({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { id, sessionId } = use(params);

  const collection = useQuery(api.collections.getById, {
    id: id as Id<"collections">,
  });
  const session = useQuery(api.sessions.getById, {
    id: sessionId as Id<"sessions">,
  });
  const comments = useQuery(api.sessionComments.getBySession, {
    sessionId: sessionId as Id<"sessions">,
  });

  if (!comments || !session || !collection)
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );

  return (
    <main className="w-full flex flex-col h-screen overflow-auto">
      <header className="flex flex-row items-center p-2 justify-between">
        <div className="flex flex-row items-center gap-4">
          <SidebarTrigger variant="outline" className="rounded-full" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/collections">
                  Collections
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/collections">
                  {collection.title}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin/collections/${id}/sessions`}>
                  Sessions
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin/collections/${id}/sessions`}>
                  {formatInTimeZone(
                    new Date(session.timestamp),
                    "Europe/London",
                    "EEE MMM d, HH:mm"
                  )}{" "}
                  {capitalise(session.type)} Session
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Comments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div></div>
      </header>

      <CommentsList comments={comments} />
    </main>
  );
}
