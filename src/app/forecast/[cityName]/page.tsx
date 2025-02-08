'use client'

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button, Container, Spinner} from "react-bootstrap";
import {useForecastStore} from "@/stores/current-forecast-store";
import styles from "./forecast.module.scss";
import {getForecastByCityName} from "@/services/home_page_requests";

export default function ForecastDetails({params}: { params: Promise<{ cityName: string }> }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {forecast, setForecast} = useForecastStore();
  const cityName = React.use(params).cityName;

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        if (cityName) {
          const response = await getForecastByCityName(cityName);
          setForecast(response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setIsLoading(false);
      }
    };

    if (cityName) {
      fetchForecast();
    }
  }, [cityName, setForecast]);

  if (isLoading) {
    return (
      <Container className={styles.page}>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary"/>
          <p>Loading forecast data for {cityName}...</p>
        </div>
      </Container>
    );
  }

  if (!forecast) {
    return (
      <Container className={styles.page}>
        <p className="text-center mt-5">No forecast data available. Try searching for a city.</p>
        <div className={styles.buttonContainer}>
          <Button variant="primary" className="mt-3" onClick={() => router.push("/")}>
            ← Back to Home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className={styles.page}>
      <div className={styles.buttonContainer}>
        <Button variant="primary" className="mt-3 align-self-start" onClick={() => router.push("/")}>
          ← Back to Home
        </Button>
      </div>

      <div className="text-center w-100 mt-4">
        <h1 className={styles.title}>{cityName}</h1>

        <div className={styles.scrollContainer}>
          {forecast.map((forecastItem) => (
            <div key={forecastItem.date} className={styles.forecastCard}>
              <h3>{forecastItem.date}</h3>
              <p>{forecastItem.weather}</p>
              <p className={styles.temp}>Temperature: {forecastItem.temp}°C</p>
              <p>Min Temp: {forecastItem.tempMin}°C</p>
              <p>Max Temp: {forecastItem.tempMax}°C</p>
              <p>Humidity: {forecastItem.humidity}%</p>
              <p>Wind Speed: {forecastItem.windSpeed} m/s</p>
              <p>Pressure: {forecastItem.pressure} hPa</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
