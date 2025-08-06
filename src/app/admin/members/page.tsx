"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MembersTable } from "@/components/users-table";
import { useMembers } from "@/hooks/use-members";
import { Loader2Icon } from "lucide-react";

export default function Page() {
  const { data: members, isLoading, refetch } = useMembers();

  return (
    <div className="h-screen flex flex-col">
      <header className="h-10 px-2 gap-2 sticky top-0 bg-background z-10 border-b flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />

          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Members</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {isLoading && (
        <div className="flex justify-center p-4">
          <Loader2Icon className="animate-spin" />
        </div>
      )}

      {members && <MembersTable members={members} refetch={refetch} />}
    </div>
  );
}
