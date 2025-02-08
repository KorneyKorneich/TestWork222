import axios from "axios";
import {ForecastResponse, WeatherResponse} from "@/lib/weatherAPI";

const API_KEY = '75b2078079ca880ddc35e8243107a5f7'

export const getWeatherByCityName = async (city: string) => {
  try {
    const response = await axios.get<WeatherResponse>(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getForecastByCityName = async (city: string) => {
  try {
    const response = await axios.get<ForecastResponse>(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}