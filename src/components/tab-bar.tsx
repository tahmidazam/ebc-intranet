import { useIntranetStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { BookUser, CalendarIcon, LinkIcon, SettingsIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";

export function TabBar() {
  const tab = useIntranetStore(useShallow((state) => state.tab));
  const setTab = useIntranetStore(useShallow((state) => state.setTab));

  return (
    <div
      className="fixed bottom-0 left-0 grid grid-cols-4 w-full bg-background/10 backdrop-blur-3xl border-t pt-2 z-20"
      style={{
        paddingBottom: "calc(var(--spacing) * 2 + env(safe-area-inset-bottom))",
      }}
    >
      <div
        className={cn(
          "flex flex-col items-center text-xs font-medium gap-1 text-foreground/50",
          tab === "links" && "text-foreground"
        )}
        onClick={() => setTab("links")}
      >
        <LinkIcon className="size-5" />
        Links
      </div>

      <div
        className={cn(
          "flex flex-col items-center text-xs font-medium gap-1 text-foreground/50",
          tab === "sessions" && "text-foreground"
        )}
        onClick={() => setTab("sessions")}
      >
        <CalendarIcon className="size-5" />
        My Sessions
      </div>

      <div
        className={cn(
          "flex flex-col items-center text-xs font-medium gap-1 text-foreground/50",
          tab === "directory" && "text-foreground"
        )}
        onClick={() => setTab("directory")}
      >
        <BookUser className="size-5" />
        Directory
      </div>

      <div
        className={cn(
          "flex flex-col items-center text-xs font-medium gap-1 text-foreground/50",
          tab === "settings" && "text-foreground"
        )}
        onClick={() => setTab("settings")}
      >
        <SettingsIcon className="size-5" />
        Settings
      </div>
    </div>
  );
}
