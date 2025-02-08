"use client";

import {useEffect, useState} from "react";
import styles from "./page.module.scss";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {getWeatherByCityName} from "@/services/home_page_requests";
import {useCurrenWeather} from "@/stores/current-weather-store";
import Link from "next/link";
import {Nullable} from "@/utils/nullable";
import {useFavoriteForecasts} from "@/stores/favorites-forecast-store";
import {WeatherItem} from "@/lib/types";
import {useRouter} from "next/navigation";

export default function Home() {
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);

  const {currentForecast, setCurrenForecast} = useCurrenWeather();
  const {addFavorite, favoritesList} = useFavoriteForecasts();
  const router = useRouter();

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await fetchWeather();
  };

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    if (!city) return;

    try {
      const forecast = await getWeatherByCityName(city);
      if (forecast) {
        setCurrenForecast(forecast);
        setIsLoading(false);
      } else {
        setError("No data found for the city. Please try another.");
        setIsLoading(false);
      }
    } catch (e) {
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  const isFavorite = (forecast: WeatherItem) => {
    return favoritesList.some((favorite: WeatherItem) => favorite.name === forecast.name);
  };

  const handleAddFavorite = () => {
    if (currentForecast && !isFavorite(currentForecast)) {
      addFavorite(currentForecast);
    }
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      parsedFavorites.forEach((forecast: WeatherItem) => addFavorite(forecast));
    }
  }, [addFavorite]);

  return (
    <main className={styles.main}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h1 className={`${styles.heading} text-center fw-bold mb-4`}>Weather Forecast</h1>
            <Form className={`${styles.searchForm}`} onSubmit={onFormSubmit}>
              <Row>
                <Col xs={8} md={9}>
                  <Form.Control
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter city name..."
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Col>
                <Col>
                  <Button
                    className={styles.searchButton}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </Col>
              </Row>
            </Form>

            {isLoading ? (
              <div className={styles.spinnerContainer}>
                <Spinner animation="border" variant="primary"/>
                <p>Loading forecast data...</p>
              </div>
            ) : error !== null ? (
              <Container className={styles.page}>
                <Alert variant="danger" className={styles.errorAlert}>
                  {error}
                </Alert>
              </Container>
            ) : currentForecast ? (
              <div className={styles.weatherBlock}>
                <h2 className="text-center text-success">{currentForecast.name}</h2>
                <p className="text-center">{currentForecast.weather[0].description}</p>
                <h3 className={`${styles.weatherTemp} text-center`}>{currentForecast.main.temp}°C</h3>
                <Link className={styles.weatherLink} href={`/forecast/${currentForecast.name}`}>
                  Weather forecast in {currentForecast.name}
                </Link>

                <Button
                  className={`${styles.searchButton} mt-3`}
                  size={"sm"}
                  onClick={isFavorite(currentForecast) ? () => router.push("/favorites") : handleAddFavorite}
                >
                  {isFavorite(currentForecast) ? "Go to favorites" : "Add to Favorites"}
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
