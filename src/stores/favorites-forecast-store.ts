import { create } from "zustand";
import { WeatherItem } from "@/lib/types";

interface FavoriteForecastsStore {
  favoritesList: WeatherItem[];
  addFavorite: (city: WeatherItem) => void;
  removeFavorite: (city: string) => void;
}

export const useFavoriteForecasts = create<FavoriteForecastsStore>((set) => {
  const storedFavorites = typeof window !== "undefined" ? localStorage.getItem("favorites") : null;
  const initialFavorites: WeatherItem[] = storedFavorites ? JSON.parse(storedFavorites) : [];

  return {
    favoritesList: initialFavorites,

    addFavorite: (city) =>
      set((state) => {
        const updatedFavorites = [...state.favoritesList, city];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        return { favoritesList: updatedFavorites };
      }),

    removeFavorite: (city) =>
      set((state) => {
        const updatedFavorites = state.favoritesList.filter((fav) => fav.name !== city);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        return { favoritesList: updatedFavorites };
      }),
  };
});
