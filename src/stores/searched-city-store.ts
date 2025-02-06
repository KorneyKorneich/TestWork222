import { create } from "zustand";

interface SearchedCityStore {
  searchHistory: string[];
  addSearchedCity: (city: string) => void;
}

export const useSearchedCity = create<SearchedCityStore>((set) => ({
  searchHistory: [],
  addSearchedCity: (city) =>
    set((state) => ({
      searchHistory: [...state.searchHistory, city],
    })),
}));
