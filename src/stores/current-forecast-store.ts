import {create} from 'zustand';
import {City, ForecastItem, ForecastResponse} from '@/lib/weatherAPI';

interface AggregatedForecastItem {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weather: string;
  icon: string;
}

interface ForecastStore {
  forecast: AggregatedForecastItem[] | null;
  city: City | null;
  setForecast: (data: ForecastResponse) => void;
  clearForecast: () => void;
}

export const useForecastStore = create<ForecastStore>((set) => ({
  forecast: null,
  city: null,
  setForecast: (data: ForecastResponse) => {
    const groupedByDate = data.list.reduce((acc, forecastItem) => {
      const date = new Date(forecastItem.dt * 1000).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(forecastItem);
      return acc;
    }, {} as Record<string, ForecastItem[]>);

    const groupedForecast = Object.keys(groupedByDate).map((date) => {
      const forecastForDay = groupedByDate[date][0];
      return {
        date,
        temp: forecastForDay.main.temp,
        tempMin: forecastForDay.main.temp_min,
        tempMax: forecastForDay.main.temp_max,
        humidity: forecastForDay.main.humidity,
        windSpeed: forecastForDay.wind.speed,
        pressure: forecastForDay.main.pressure,
        weather: forecastForDay.weather[0].description,
        icon: forecastForDay.weather[0].icon,
      };
    });

    set(() => ({
      forecast: groupedForecast,
      city: data.city,
    }));
  },
  clearForecast: () => set(() => ({
    forecast: null,
    city: null,
  })),
}));
