import { create } from "zustand";
import {WeatherResponse} from "@/lib/weatherAPI";
import {Nullable} from "@/utils/nullable";

interface CurrentForecastStore {
  currentForecast: Nullable<WeatherResponse>;
  setCurrenForecast: (forecast: WeatherResponse) => void;
}

export const useCurrenForecast = create<CurrentForecastStore>((set) => ({
  currentForecast: null,
  setCurrenForecast: (forecast) =>
    set(() => ({currentForecast: forecast})),
}));
