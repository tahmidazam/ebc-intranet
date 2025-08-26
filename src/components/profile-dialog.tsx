import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
        <DialogTitle>Profile</DialogTitle>

        <div className="flex flex-col gap-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Name</p>
              <p>{user?.fullName}</p>
            </div>

            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Collection Access</p>
            <div className="flex flex-wrap gap-2">
              {collections.map((collection) => (
                <Badge key={collection._id} variant="outline">
                  {collection.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" className="rounded-full">
              Sign out
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
