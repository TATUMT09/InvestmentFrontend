import { create } from "zustand";
import { Momo, MomoFilters } from "@/types/momo.types";

interface MomoStore {
  momolar: Momo[];
  selectedMomo: Momo | null;
  filters: MomoFilters;
  isLoading: boolean;
  setMomolar: (momolar: Momo[]) => void;
  setSelectedMomo: (momo: Momo | null) => void;
  setFilters: (filters: Partial<MomoFilters>) => void;
  resetFilters: () => void;
  setLoading: (val: boolean) => void;
}

export const useMomoStore = create<MomoStore>((set) => ({
  momolar: [],
  selectedMomo: null,
  filters: {},
  isLoading: false,

  setMomolar: (momolar) => set({ momolar }),
  setSelectedMomo: (momo) => set({ selectedMomo: momo }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {} }),
  setLoading: (val) => set({ isLoading: val }),
}));
