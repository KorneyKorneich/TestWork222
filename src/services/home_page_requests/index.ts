import axios from "axios";
import {WeatherResponse} from "@/lib/weatherAPI";

const API_KEY = '75b2078079ca880ddc35e8243107a5f7'

export const getWeatherForecastByCityName = async (city: string) => {

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