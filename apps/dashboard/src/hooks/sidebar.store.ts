import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SidebarState {
  collapsed?: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      setCollapsed: (collapsed: boolean) => set({ collapsed }),
    }),
    {
      name: "sidebarState",
    }
  )
);

export default useSidebarStore;
