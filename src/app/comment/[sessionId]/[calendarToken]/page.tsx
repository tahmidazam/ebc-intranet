"use client";

import { CommentsList } from "@/components/comments-list";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { use, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function Comment({
  params,
}: {
  params: Promise<{ sessionId: string; calendarToken: string }>;
}) {
  const { sessionId, calendarToken } = use(params);

  const session = useQuery(api.sessions.getById, {
    id: sessionId as Id<"sessions">,
  });

  const resolvedToken = useQuery(api.calendarTokens.resolveToken, {
    token: calendarToken,
  });

  const comments = useQuery(api.sessionComments.getBySession, {
    sessionId: sessionId as Id<"sessions">,
  });

  const postComment = useMutation(api.sessionComments.postComment);

  const [content, setContent] = useState("");

  if (!session || !comments || !resolvedToken)
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
            author: resolvedToken.coach ? resolvedToken.id : undefined,
            userId: resolvedToken.coach
              ? undefined
              : (resolvedToken.id as Id<"users">),
          });
          setContent("");
        }}
      >
        Post
      </Button>

      <div className="flex flex-col">
        <CommentsList comments={comments} />
      </div>
    </div>
  );
}
