import {create} from "zustand";
import {WeatherResponse} from "@/lib/weatherAPI";
import {Nullable} from "@/utils/nullable";

interface CurrentWeatherStore {
  currentForecast: Nullable<WeatherResponse>;
  setCurrenForecast: (forecast: WeatherResponse) => void;

}

export const useCurrenWeather = create<CurrentWeatherStore>((set) => ({
  currentForecast: null,
  setCurrenForecast: (forecast) => {
    localStorage.setItem("currentForecast", JSON.stringify(forecast));
    set(() => ({currentForecast: forecast}));
  },
}));