import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IntranetState {
  pinnedLinkIds: string[];
  togglePinLink: (linkId: string) => void;
  showEmptyCollections: boolean;
  setShowEmptyCollections: (value: boolean) => void;
  showCollectionInPinnedLinks: boolean;
  setShowCollectionInPinnedLinks: (value: boolean) => void;
  keepCollectionsCollapsed: boolean;
  setKeepCollectionsCollapsed: (value: boolean) => void;
  onlyShowPinnedLinks: boolean;
  setOnlyShowPinnedLinks: (value: boolean) => void;
  tab: "links" | "sessions" | "settings";
  setTab: (tab: "links" | "sessions" | "settings") => void;
  sessionsToDisplay: "upcoming" | "past";
  setSessionsToDisplay: (value: "upcoming" | "past") => void;
}

export const useIntranetStore = create<IntranetState>()(
  persist(
    (set) => ({
      pinnedLinkIds: [],
      togglePinLink: (linkId: string) =>
        set((state) => ({
          pinnedLinkIds: state.pinnedLinkIds.includes(linkId)
            ? state.pinnedLinkIds.filter((id) => id !== linkId)
            : [...state.pinnedLinkIds, linkId],
        })),
      showEmptyCollections: false,
      setShowEmptyCollections: (value: boolean) =>
        set({ showEmptyCollections: value }),
      showCollectionInPinnedLinks: true,
      setShowCollectionInPinnedLinks: (value: boolean) =>
        set({ showCollectionInPinnedLinks: value }),
      keepCollectionsCollapsed: false,
      setKeepCollectionsCollapsed: (value: boolean) =>
        set({ keepCollectionsCollapsed: value }),
      onlyShowPinnedLinks: false,
      setOnlyShowPinnedLinks: (value: boolean) =>
        set({ onlyShowPinnedLinks: value }),
      tab: "links",
      setTab: (tab) => set({ tab }),
      sessionsToDisplay: "upcoming",
      setSessionsToDisplay: (value) => set({ sessionsToDisplay: value }),
    }),
    {
      name: "intranet-store",
    }
  )
);
