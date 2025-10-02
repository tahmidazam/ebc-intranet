import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { ArrowUp, Loader2Icon, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { CommentsList } from "./comments-list";

export function CommentsDrawer({
  sessionId,
  className,
}: {
  sessionId: Id<"sessions">;
  className?: string;
}) {
  const comments = useQuery(api.sessionComments.getBySession, {
    sessionId,
  });
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState("");
  const postComment = useMutation(api.sessionComments.postComment);
  const user = useQuery(api.user.currentUser);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-full", className)}
          size="icon"
        >
          <MessageCircle />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        showClose={false}
        style={{
          height: "calc(100% - env(safe-area-inset-top))",
        }}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 w-full bg-background flex flex-col border-b z-20">
            <div className="flex items-center justify-between px-4 border-b py-2 ">
              <SheetTitle className="text-center">Comments</SheetTitle>

              <SheetClose asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <X />
                </Button>
              </SheetClose>
            </div>

            <div className="flex items-center justify-between px-4 gap-2  py-2 ">
              <Input
                className="rounded-full"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
              />

              <Button
                size="icon"
                className="rounded-full"
                disabled={!comment || !user}
                onClick={async () => {
                  if (!user) return;
                  await postComment({
                    sessionId,
                    content: comment,
                    userId: user._id,
                  });
                  setComment("");
                }}
              >
                <ArrowUp />
              </Button>
            </div>
          </div>

          <div
            className="flex flex-col"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom))",
            }}
          >
            {comments ? (
              <CommentsList comments={comments} />
            ) : (
              <div className="flex items-center justify-center flex-grow w-full">
                <Loader2Icon className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
