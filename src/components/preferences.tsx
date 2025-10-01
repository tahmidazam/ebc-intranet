import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { capitalise } from "@/lib/capitalise";
import { formatName } from "@/lib/format-name";
import { useIntranetStore } from "@/lib/store";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { CircleAlert } from "lucide-react";
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
      <h2
        className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm sticky bg-background z-10"
        style={{
          top: "calc(env(safe-area-inset-top) + 56px)",
        }}
      >
        Athlete Profile
      </h2>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          {user && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p>{formatName(user)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>

              {user.sidePreference && (
                <div>
                  <p className="text-muted-foreground">Side Preference</p>
                  <p>{capitalise(user.sidePreference)}</p>
                </div>
              )}

              {user.cox !== undefined && (
                <div>
                  <p className="text-muted-foreground">Cox</p>
                  <p>{user.cox ? "Yes" : "No"}</p>
                </div>
              )}

              {user.novice !== undefined && (
                <div>
                  <p className="text-muted-foreground">Novice</p>
                  <p>{user.novice ? "Yes" : "No"}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">My Collections</p>
            <div className="flex items-center flex-wrap gap-2">
              {collections.map((collection) => (
                <Badge key={collection._id} variant="outline">
                  {collection.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button className="rounded-full" variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <h2
        className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm sticky bg-background z-10"
        style={{
          top: "calc(env(safe-area-inset-top) + 56px)",
        }}
      >
        Calendar
      </h2>

      <div className="p-4 flex flex-col gap-4">
        {user?._id && (
          <CalendarUrlP id={user._id} className="break-all text-xs font-mono" />
        )}

        {user?._id && <CalendarUrlP id={user._id} button />}

        <p className="text-sm text-muted-foreground">
          Follow this link directly if you want to add it to your operating
          system&apos;s calendar app.
        </p>

        {user?._id && (
          <CalendarUrlP
            id={user._id}
            useHttps
            className="break-all text-xs font-mono"
          />
        )}

        {user?._id && <CalendarUrlP id={user._id} clipboardButton />}

        <p className="text-sm text-muted-foreground">
          Copy paste this link into the calendar subscription URL field in your
          third-party calendar client (e.g., Outlook).{" "}
        </p>

        <div className="flex items-center gap-2 text-orange-500 text-sm p-2 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-200 dark:border-orange-900 box-border">
          <CircleAlert className="shrink-0 size-5 mx-2" />

          <p className="grow">
            Do not follow this link directly; otherwise your calendar will not
            update automatically.
          </p>
        </div>
      </div>

      <h2
        className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm sticky bg-background z-10"
        style={{
          top: "calc(env(safe-area-inset-top) + 56px)",
        }}
      >
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
    </>
  );
}
