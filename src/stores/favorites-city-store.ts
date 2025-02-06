import { create } from "zustand";
import { WeatherItem } from "@/lib/types";

interface FavoritesCityStore {
  favoritesList: WeatherItem[];
  addFavorite: (city: WeatherItem) => void;
}

export const useFavoriteCity = create<FavoritesCityStore>((set) => ({
  favoritesList: [],
  addFavorite: (city) =>
    set((state) => ({
      favoritesList: [...state.favoritesList, city],
    })),
}));
