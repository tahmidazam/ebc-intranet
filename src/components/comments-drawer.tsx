import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatInTimeZone } from "date-fns-tz";
import { Loader2Icon, MessageCircle } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";

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
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("rounded-full", className)}
          size="icon"
        >
          <MessageCircle />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background rounded-t-2xl mt-24 h-[80%] lg:h-[320px] fixed bottom-0 left-0 right-0">
        <div className="flex-1 overflow-y-auto rounded-t-2xl">
          <div className="fixed top-0 w-full bg-background py-2 gap-4 flex flex-col border-b rounded-t-2xl">
            <div
              aria-hidden
              className="mx-auto w-12 h-1 flex-shrink-0 rounded-full bg-foreground/20"
            />
            <DrawerTitle className="text-center">Comments</DrawerTitle>
          </div>

          <div
            className="flex flex-col gap-4 p-4"
            style={{
              paddingTop: "72px",
              paddingBottom: "calc(env(safe-area-inset-bottom))",
            }}
          >
            {comments ? (
              comments.map((comment) => (
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
              ))
            ) : (
              <div className="flex items-center justify-center flex-grow w-full">
                <Loader2Icon className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
