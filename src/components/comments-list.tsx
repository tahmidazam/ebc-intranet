import { formatRelativeDate } from "@/lib/format-relative-date";
import { isDriveLink } from "@/lib/is-drive-link";
import { Doc } from "../../convex/_generated/dataModel";
import DriveEmbed from "./drive-embed";

export function CommentsList({
  comments,
}: {
  comments: Doc<"sessionComments">[];
}) {
  return (
    <>
      {comments.map((comment) => {
        const isDrive = isDriveLink(comment.content);

        if (isDrive) {
          return (
            <div
              key={comment._id}
              className="flex flex-col gap-1 border-b px-4 py-2"
            >
              <div className="text-sm text-muted-foreground">
                {comment.author} ·{" "}
                {formatRelativeDate(new Date(comment.timestamp))}
              </div>
              <DriveEmbed key={comment._id} link={comment.content} />
            </div>
          );
        } else {
          return (
            <div key={comment._id} className="border-b px-4 py-2">
              <div className="text-sm text-muted-foreground">
                {comment.author} ·{" "}
                {formatRelativeDate(new Date(comment.timestamp))}
              </div>
              <div className="flex flex-col gap-2">
                {comment.content.split(/  /g).map((line, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
