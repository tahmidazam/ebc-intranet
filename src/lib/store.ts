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
    }),
    {
      name: "intranet-store",
    }
  )
);
