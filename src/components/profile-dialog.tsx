import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Doc } from "../../convex/_generated/dataModel";

export function ProfileDialog({
  children,
  collections,
}: {
  children: React.ReactNode;
  collections: Doc<"collections">[];
}) {
  const { user } = useUser();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-3xl p-4">
        <div>
          <DialogTitle>{user?.fullName}</DialogTitle>
          <DialogDescription>
            {user?.primaryEmailAddress?.emailAddress}
          </DialogDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          {collections.map((collection) => (
            <Badge key={collection._id} variant="outline">
              {collection.title}
            </Badge>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" className="rounded-full">
              Sign out
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
