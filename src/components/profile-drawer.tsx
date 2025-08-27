import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useUser } from "@clerk/nextjs";
import { Doc } from "../../convex/_generated/dataModel";

export function ProfileDrawer({
  children,
  collections,
}: {
  children: React.ReactNode;
  collections: Doc<"collections">[];
}) {
  const { user } = useUser();

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "calc(100vh - env(safe-area-inset-top))",
        }}
      >
        <DrawerHeader>
          <DrawerTitle>{user?.fullName}</DrawerTitle>
          <DrawerDescription>
            {user?.primaryEmailAddress?.emailAddress}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex items-center justify-center flex-wrap gap-2">
          {collections.map((collection) => (
            <Badge key={collection._id} variant="outline">
              {collection.title}
            </Badge>
          ))}
        </div>

        <DrawerFooter className="grid grid-cols-2">
          <Button className="rounded-full" variant="destructive">
            Sign out
          </Button>

          <DrawerClose asChild>
            <Button className="rounded-full" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
