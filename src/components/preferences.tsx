import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatName } from "@/lib/format-name";
import { useIntranetStore } from "@/lib/store";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useShallow } from "zustand/shallow";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { CalendarUrlP } from "./calendar-url-p";
export function Preferences({
  collections,
}: {
  collections: Doc<"collections">[];
}) {
  const user = useQuery(api.user.currentUser);
  const { signOut } = useAuthActions();
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
  const keepCollectionsCollapsed = useIntranetStore(
    useShallow((state) => state.keepCollectionsCollapsed)
  );
  const setKeepCollectionsCollapsed = useIntranetStore(
    useShallow((state) => state.setKeepCollectionsCollapsed)
  );
  const onlyShowPinnedLinks = useIntranetStore(
    useShallow((state) => state.onlyShowPinnedLinks)
  );
  const setOnlyShowPinnedLinks = useIntranetStore(
    useShallow((state) => state.setOnlyShowPinnedLinks)
  );

  return (
    <>
      <h2 className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm">
        Profile
      </h2>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {user && (
            <div>
              <p>{formatName(user)}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          )}

          <div className="flex items-center flex-wrap gap-2">
            {collections.map((collection) => (
              <Badge key={collection._id} variant="outline">
                {collection.title}
              </Badge>
            ))}
          </div>
        </div>

        <DrawerClose asChild>
          <Button className="rounded-full" variant="outline" onClick={signOut}>
            Sign out
          </Button>
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
          <Label htmlFor="show-empty-collections">Show Empty Collections</Label>
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

        <div className="flex items-center space-x-2">
          <Switch
            id="collections-collapsed-by-default"
            checked={keepCollectionsCollapsed}
            onCheckedChange={setKeepCollectionsCollapsed}
          />
          <Label htmlFor="collections-collapsed-by-default">
            <p>Keep Collections Collapsed</p>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="only-show-pinned-links"
            checked={onlyShowPinnedLinks}
            onCheckedChange={setOnlyShowPinnedLinks}
          />
          <Label htmlFor="only-show-pinned-links">
            <p>Only Show Pinned Links</p>
          </Label>
        </div>
      </div>

      <h2 className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm">
        Calendar
      </h2>

      <div className="p-4 flex flex-col gap-4">
        <CalendarUrlP
          id={user?._id ?? ""}
          className="break-all text-sm font-mono"
        />

        <p className="text-sm text-muted-foreground">
          Follow this link directly if you want to add it to your operating
          system&apos;s calendar app.
        </p>

        <CalendarUrlP
          useHttps
          id={user?._id ?? ""}
          className="break-all text-sm font-mono"
        />

        <p className="text-sm text-muted-foreground">
          Copy paste this link into the calendar subscription URL field in your
          third-party calendar client (e.g., Outlook). Do not follow this link
          directly; otherwise your calendar will not update automatically.
        </p>
      </div>
    </>
  );
}
