import {create} from "zustand";
import {WeatherResponse} from "@/lib/weatherAPI";
import {Nullable} from "@/utils/nullable";
import {useEffect, useState} from "react";

interface CurrentForecastStore {
  currentForecast: Nullable<WeatherResponse>;
  setCurrenForecast: (forecast: WeatherResponse) => void;
}

export const useCurrenForecast = create<CurrentForecastStore>((set) => ({
  currentForecast: null,
  setCurrenForecast: (forecast) => {
    localStorage.setItem("currentForecast", JSON.stringify(forecast));
    set(() => ({currentForecast: forecast}));
  },
}));

// Custom hook to initialize the Zustand store with localStorage data after mount
export const useInitializeForecast = () => {
  const [isClient, setIsClient] = useState(false);
  const setCurrenForecast = useCurrenForecast((state) => state.setCurrenForecast);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined" && localStorage.getItem("currentForecast")) {
      const storedForecast = JSON.parse(localStorage.getItem("currentForecast")!);
      setCurrenForecast(storedForecast);
    }
  }, [setCurrenForecast]);

  return isClient;
};
