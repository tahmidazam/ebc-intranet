import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IntranetState {
  pinnedLinkIds: string[];
  togglePinLink: (linkId: string) => void;
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
    }),
    {
      name: "intranet-store",
    }
  )
);
