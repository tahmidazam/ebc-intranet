"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const collections = useQuery(api.collections.getUserCollectionsWithLinks);

  if (!collections) {
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <Loader2Icon className="animate-spin" />
      </main>
    );
  }

  return (
    <Table>
      <TableBody>
        {collections.map((collection) => (
          <React.Fragment key={collection._id}>
            <TableRow>
              <TableCell className="font-medium">{collection.title}</TableCell>
            </TableRow>

            {collection.links.map((link) => (
              <TableRow key={link._id}>
                <TableCell>
                  <Link href={link.url}>{link.title}</Link>
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
