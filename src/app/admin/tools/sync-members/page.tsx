"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SheetMember } from "@/schemas/sheet-member";
import { getAvailabilitiesFromSheet } from "@/server-actions/get-sheet-info";
import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";

export default function SyncMembersPage() {
  const syncSheetMembers = useMutation(api.user.syncSheetMembers);
  const [csv, setCsv] = useState<SheetMember[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const docId = formData.get("docId") as string;
      const sheetTitle = formData.get("sheetTitle") as string;

      const csv = await getAvailabilitiesFromSheet(docId, sheetTitle);
      setCsv(csv);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get sheet info.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!csv) return;
    const json = JSON.stringify(csv, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleSync = async () => {
    if (!csv) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const membersWithoutCrsid = csv.map(({ crsid, phone, ...rest }) => rest);
    await syncSheetMembers({
      members: membersWithoutCrsid,
    });
  };

  return (
    <main className="w-full flex flex-col h-screen overflow-auto">
      <header className="flex flex-row items-center p-2 justify-between">
        <div className="flex flex-row items-center gap-4">
          <SidebarTrigger variant="outline" className="rounded-full" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>Admin</BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>Tools</BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Sync Members</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center flex-grow w-full">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 p-4 max-w-4xl mx-auto w-full">
          <div className="flex flex-col gap-4 text-sm text-muted-foreground text-pretty">
            <p>
              This tool allows you to sync members from a Google Sheet to update
              their cox status, novice status, side preference, and
              availabilities.
            </p>

            <p>
              If members (matched by email address) already exist, their
              information will be updated; otherwise, new member accounts will
              be created with the information from the sheet. No members will be
              deleted.
            </p>

            <p>
              Reading from the sheet can fail if the data validation is not
              respected. Ensure values are set for side preferences, and ensure
              availabilities strictly follow the format outlined.
            </p>

            <p>
              Note that new members created via this syncing process will not be
              automatically added to any collections. Use the{" "}
              <Link
                href="/admin/tools/bulk-update-access"
                className="underline underline-offset-4 decoration-border"
              >
                Bulk Update Access
              </Link>{" "}
              tool to add them to the appropriate collections.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-sm mx-auto w-full"
          >
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="docId">Google Sheet Document ID</Label>
              <Input
                type="text"
                name="docId"
                className="rounded-full"
                defaultValue="1swwFSMeQBNK-EzOVvoa6WPUSmLc1o5qYQ2hhflmnwEw"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="sheetTitle">Sheet Title</Label>
              <Input
                type="text"
                name="sheetTitle"
                defaultValue="Availabilities"
                className="rounded-full"
              />
            </div>

            <Button type="submit" className="rounded-full" variant="outline">
              Read Sheet
            </Button>

            <Button
              onClick={handleOpen}
              className="rounded-full"
              disabled={!csv}
              variant="outline"
            >
              Open Sheet Info
            </Button>

            <Button
              onClick={handleSync}
              className="rounded-full"
              disabled={!csv}
            >
              Sync Members
            </Button>
          </form>
        </div>
      )}
    </main>
  );
}
