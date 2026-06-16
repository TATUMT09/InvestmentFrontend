import { create } from "zustand";

interface UiStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (val: boolean) => void;
  lightMode: boolean;
  toggleTheme: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (val) => set({ sidebarOpen: val }),
  lightMode: false,
  toggleTheme: () => set((state) => ({ lightMode: !state.lightMode })),
}));
