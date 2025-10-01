"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decodeName } from "@/lib/coach-name-encryption";
import { formatName } from "@/lib/format-name";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import { useMutation, useQuery } from "convex/react";
import { formatInTimeZone } from "date-fns-tz";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function Comment({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const encodedCoach = searchParams.get("coach");
  const { data: coach } = useTanStackQuery({
    queryKey: ["coachName", encodedCoach],
    queryFn: async () => {
      if (!encodedCoach) return null;
      return decodeName(encodedCoach);
    },
  });

  const session = useQuery(api.sessions.getById, {
    id: sessionId as Id<"sessions">,
  });

  const comments = useQuery(api.sessionComments.getBySession, {
    sessionId: sessionId as Id<"sessions">,
  });

  const postComment = useMutation(api.sessionComments.postComment);

  const [content, setContent] = useState("");

  const user = useQuery(api.user.tryGetById, {
    id: userId ?? undefined,
  });

  if (!userId && !coach) return <>Loading...</>;

  if (!session || !comments)
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 gap-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="rounded-2xl"
        rows={16}
      />

      <Button
        className="rounded-full w-40 ml-auto"
        onClick={() => {
          postComment({
            sessionId: session._id,
            content,
            author: user
              ? formatName(user) ?? coach ?? "Unknown"
              : coach ?? "Unknown",
          });
          setContent("");
        }}
      >
        Post
      </Button>

      {comments.map((comment) => (
        <div key={comment._id}>
          <div className="text-sm text-muted-foreground">
            {comment.author} ·{" "}
            {formatInTimeZone(
              new Date(comment.timestamp),
              "Europe/London",
              "EEE MMM d, HH:mm"
            )}
          </div>
          <div>{comment.content}</div>
        </div>
      ))}
    </div>
  );
}
