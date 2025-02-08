import {create} from "zustand";
import {WeatherItem} from "@/lib/types";

interface FavoriteForecastsStore {
  favoritesList: WeatherItem[];
  addFavorite: (city: WeatherItem) => void;
  removeFavorite: (city: string) => void;
}

export const useFavoriteForecasts = create<FavoriteForecastsStore>((set) => ({
  favoritesList: [],
  addFavorite: (city) =>
    set((state) => {
      const isAlreadyFavorite = state.favoritesList.some((favorite) => favorite.name === city.name);
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...state.favoritesList, city];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        return {favoritesList: updatedFavorites};
      }
      return state;
    }),
  removeFavorite: (city) =>
    set((state) => {
      const updatedFavorites = state.favoritesList.filter((fav) => fav.name !== city);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return {favoritesList: updatedFavorites};
    }),
}));
