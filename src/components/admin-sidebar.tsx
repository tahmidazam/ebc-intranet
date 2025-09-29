"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserSidebarMenuItem } from "@/components/user-sidebar-menu-item";
import {
  Bike,
  ChevronLeft,
  FolderGit,
  FolderSyncIcon,
  Grid3x2,
  Library,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Collections",
    href: "/admin/collections",
    icon: Library,
  },
  {
    title: "Members",
    href: "/admin/members",
    icon: Users2,
  },
  {
    title: "Coaches",
    href: "/admin/coaches",
    icon: Bike,
  },
];

const tools = [
  {
    title: "Bulk Update Access",
    href: "/admin/tools/bulk-update-access",
    icon: Grid3x2,
  },
  {
    title: "Sync Members",
    href: "/admin/tools/sync-members",
    icon: FolderSyncIcon,
  },
];

const links = [
  {
    title: "Back to Intranet",
    href: "/",
    icon: ChevronLeft,
  },
  {
    title: "Repository",
    href: "https://www.github.com/tahmidazam/ebc-intranet",
    icon: FolderGit,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <UserSidebarMenuItem />
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(tool.href)}
                  >
                    <Link href={tool.href}>
                      <tool.icon />
                      <span>{tool.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild>
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="text-xs text-muted-foreground">© 2025 Tahmid Azam</p>
      </SidebarFooter>
    </Sidebar>
  );
}
