"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import { forbidden } from "next/navigation";
import { api } from "../../../convex/_generated/api";

const queryClient = new QueryClient();

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
      <Toaster />
      <AdminSidebar />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SidebarProvider>
  );
}
