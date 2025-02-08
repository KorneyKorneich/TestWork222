'use client';

import {useRouter} from "next/navigation";
import {Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import Link from "next/link";
import styles from "./favorites.module.scss";
import {useFavoriteForecasts} from "@/stores/favorites-forecast-store";
import {useEffect, useState} from "react";
import {WeatherItem} from "@/lib/types";

export default function FavoriteForecasts() {
  const {favoritesList, removeFavorite, addFavorite} = useFavoriteForecasts();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      parsedFavorites.forEach((forecast: WeatherItem) => addFavorite(forecast));
    }
    setIsLoading(false);
  }, [addFavorite]);

  if (isLoading) {
    return (
      <Container className={styles.page}>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary"/>
          <p>Loading your favorite forecasts...</p>
        </div>
      </Container>
    );
  }

  if (!favoritesList || favoritesList.length === 0) {
    return (
      <Container className={styles.page}>
        <p className="text-center mt-5">No forecast data available. Try searching for a city.</p>
        <Button variant="primary" className="mt-3" onClick={() => router.push("/")}>
          ← Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className={styles.favoriteList}>
      <Row className={`${styles.header} d-flex justify-content-start align-items-start text-center`}>
        <Col md={4} xs={6}>
          <Button variant="secondary" className={styles.back_button} onClick={() => router.push("/")}>
            ← Back to Home
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={6} xs={12} className="justify-content-center align-items-center text-center mx-auto mt-1">
          <p className="m-0">Favorite forecasts</p>
        </Col>
      </Row>
      <Row className="mt-3">
        {favoritesList.length > 0 ? (
          favoritesList.map((forecast, index) => {
            const temp = forecast.main?.temp ?? "N/A";
            return (
              <Col key={index} md={4} sm={6} xs={12} className="mb-3">
                <Card className="text-center shadow">
                  <Link href={`/forecast/${forecast.name}`} passHref>
                    <Card.Body>
                      <Card.Title>{forecast.name}</Card.Title>
                      <Card.Text>
                        Temperature: {temp}°C
                        <br/>
                      </Card.Text>
                    </Card.Body>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => removeFavorite(forecast.name)}
                    className="w-100"
                  >
                    Remove
                  </Button>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col className="text-center mt-3">
            <p>No favorite forecasts yet.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
