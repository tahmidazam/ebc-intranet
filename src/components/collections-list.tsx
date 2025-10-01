import { useMobileOS } from "@/hooks/use-mobile-os";
import { useIntranetStore } from "@/lib/store";
import { transformMobileUrl } from "@/lib/transform-mobile-url";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Doc } from "../../convex/_generated/dataModel";

export function CollectionsList({
  collections,
}: {
  collections: (Doc<"collections"> & { links: Doc<"links">[] })[];
}) {
  const os = useMobileOS();

  const showEmptyCollections = useIntranetStore(
    useShallow((state) => state.showEmptyCollections)
  );
  const showCollectionInPinnedLinks = useIntranetStore(
    useShallow((state) => state.showCollectionInPinnedLinks)
  );
  const onlyShowPinnedLinks = useIntranetStore(
    useShallow((state) => state.onlyShowPinnedLinks)
  );

  const pinnedLinkIds = useIntranetStore(
    useShallow((state) => state.pinnedLinkIds)
  );

  const pinnedLinks: (Doc<"links"> & { collection: Doc<"collections"> })[] =
    useMemo(() => {
      const allLinks = collections.flatMap((collection) =>
        collection.links.map((link) => ({ ...link, collection: collection }))
      );
      return allLinks.filter((l) => pinnedLinkIds.includes(l._id));
    }, [collections, pinnedLinkIds]);

  return (
    <div className="flex flex-col">
      {pinnedLinkIds.length > 0 && (
        <>
          <h2
            className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm sticky bg-background z-10"
            style={{
              top: "calc(env(safe-area-inset-top) + 56px)",
            }}
          >
            Pinned
          </h2>

          {pinnedLinks.map((link) => (
            <div key={link._id} className="flex hover:bg-muted/50 border-b">
              <Link
                className="py-2 px-4 align-middle whitespace-nowrap grow"
                href={transformMobileUrl(link.url, os)}
              >
                <p>{link.title}</p>
                {showCollectionInPinnedLinks && (
                  <p className="text-xs text-muted-foreground">
                    {link.collection.title}
                  </p>
                )}
              </Link>

              <TogglePinButton link={link} />
            </div>
          ))}
        </>
      )}

      {!onlyShowPinnedLinks &&
        collections
          .filter((collection) => {
            if (!showEmptyCollections) {
              return collection.links.length > 0;
            }
            return true;
          })
          .map((collection) => (
            <CollectionsListSection
              key={collection._id}
              collection={collection}
            />
          ))}
    </div>
  );
}

function CollectionsListSection({
  collection,
}: {
  collection: Doc<"collections"> & { links: Doc<"links">[] };
}) {
  const os = useMobileOS();
  const keepCollectionsCollapsed = useIntranetStore(
    useShallow((state) => state.keepCollectionsCollapsed)
  );
  const [open, setOpen] = useState(!keepCollectionsCollapsed);

  return (
    <div key={collection._id} className="flex flex-col first:pt-0 pt-4">
      <div
        className="border-b py-2 px-4 flex justify-between sticky bg-background z-10"
        style={{
          top: "calc(env(safe-area-inset-top) + 56px)",
        }}
      >
        <h2 className="whitespace-nowrap font-semibold text-sm">
          {collection.title}
        </h2>
        <button onClick={() => setOpen(!open)}>
          {open ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </button>
      </div>

      {open && (
        <div>
          {collection.links.map((link) => (
            <div key={link._id} className="flex hover:bg-muted/50 border-b">
              <Link
                className="py-2 px-4 align-middle whitespace-nowrap grow"
                href={transformMobileUrl(link.url, os)}
              >
                {link.title}
              </Link>

              <TogglePinButton link={link} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TogglePinButton({ link }: { link: Doc<"links"> }) {
  const pinnedLinkIds = useIntranetStore(
    useShallow((state) => state.pinnedLinkIds)
  );
  const togglePinLink = useIntranetStore(
    useShallow((state) => state.togglePinLink)
  );

  return (
    <button className="pl-2 pr-4" onClick={() => togglePinLink(link._id)}>
      {pinnedLinkIds.includes(link._id) ? (
        <PinOffIcon className="size-4" />
      ) : (
        <PinIcon className="size-4" />
      )}
    </button>
  );
}
