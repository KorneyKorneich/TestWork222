"use client";

import {useState} from "react";
import styles from "./page.module.scss";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {getWeatherForecastByCityName} from "@/services/home_page_requests";
import {useCurrenForecast} from "@/stores/current-forecast-store";
import Link from "next/link";
import {Nullable} from "@/utils/nullable";
import {useFavoriteForecasts} from "@/stores/favorites-forecast-store";
import {WeatherItem} from "@/lib/types"; // Assuming you have this store

export default function Home() {
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);

  const {currentForecast, setCurrenForecast} = useCurrenForecast();
  const {addFavorite, favoritesList} = useFavoriteForecasts(); // Access favorites and addFavorite

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await fetchWeather();
  };

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null); // Reset error state on new search
    if (!city) return;

    try {
      const forecast = await getWeatherForecastByCityName(city);
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
                    size={"sm"}
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
                <Link className={styles.weatherLink} href={"/forecast"}>
                  Weather forecast in {currentForecast.name}
                </Link>

                {/* Add to favorites button */}
                <Button
                  className={`${styles.searchButton} mt-3`}
                  size={"sm"}
                  onClick={handleAddFavorite}
                  disabled={isFavorite(currentForecast)}
                >
                  {isFavorite(currentForecast) ? "Already in Favorites" : "Add to Favorites"}
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
