import Link from "next/link";
import { Doc } from "../../convex/_generated/dataModel";

export function CollectionsList({
  collections,
}: {
  collections: (Doc<"collections"> & { links: Doc<"links">[] })[];
}) {
  return (
    <div className="flex flex-col">
      {collections.map((collection) => (
        <div key={collection._id} className="flex flex-col first:pt-0 pt-4">
          <h2
            key={collection._id}
            className="border-b py-2 px-4 align-middle whitespace-nowrap font-semibold text-sm"
          >
            {collection.title}
          </h2>

          {collection.links.map((link) => (
            <Link
              key={link._id}
              className="hover:bg-muted/50 border-b py-2 px-4 align-middle whitespace-nowrap"
              href={link.url}
            >
              {link.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
