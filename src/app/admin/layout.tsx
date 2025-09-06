"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { forbidden } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useQuery(api.user.currentUser);

  if (user && !(user?.role === "admin")) {
    forbidden();
  }

  return (
    <SidebarProvider>
      <AdminSidebar />

      {children}
    </SidebarProvider>
  );
}
