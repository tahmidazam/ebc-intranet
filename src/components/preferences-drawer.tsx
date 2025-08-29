import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useIntranetStore } from "@/lib/store";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { XIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { Doc } from "../../convex/_generated/dataModel";

export function PreferencesDrawer({
  children,
  collections,
}: {
  children: React.ReactNode;
  collections: Doc<"collections">[];
}) {
  const { user } = useUser();
  const showEmptyCollections = useIntranetStore(
    useShallow((state) => state.showEmptyCollections)
  );
  const setShowEmptyCollections = useIntranetStore(
    useShallow((state) => state.setShowEmptyCollections)
  );
  const showCollectionInPinnedLinks = useIntranetStore(
    useShallow((state) => state.showCollectionInPinnedLinks)
  );
  const setShowCollectionInPinnedLinks = useIntranetStore(
    useShallow((state) => state.setShowCollectionInPinnedLinks)
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "calc(100vh - env(safe-area-inset-top))",
        }}
      >
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle className="font-medium text-2xl tracking-tight">
            Preferences
          </DrawerTitle>

          <DrawerClose asChild>
            <Button className="rounded-full" variant="outline" size="icon">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <h2 className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm">
          Profile
        </h2>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div>
              <p>{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {collections.map((collection) => (
                <Badge key={collection._id} variant="outline">
                  {collection.title}
                </Badge>
              ))}
            </div>
          </div>

          <DrawerClose asChild>
            <SignOutButton>
              <Button className="rounded-full" variant="outline">
                Sign out
              </Button>
            </SignOutButton>
          </DrawerClose>
        </div>

        <h2 className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm">
          View
        </h2>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-empty-collections"
              checked={showEmptyCollections}
              onCheckedChange={setShowEmptyCollections}
            />
            <Label htmlFor="show-empty-collections">
              Show Empty Collections
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-collection-in-pinned-link"
              checked={showCollectionInPinnedLinks}
              onCheckedChange={setShowCollectionInPinnedLinks}
            />
            <Label htmlFor="show-collection-in-pinned-link">
              <p>Show Collection in Pinned Links</p>
            </Label>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
