'use client'
import { useState } from "react";
import styles from "./page.module.css";
import {Button, Col, Container, Row, Form, NavLink} from "react-bootstrap";
import { getWeatherForecastByCityName } from "@/services/home_page_requests";
import { useCurrenForecast } from "@/stores/current-forecast-store";
import Link from "next/link";

export default function Home() {
  const [city, setCity] = useState("");

  const { currentForecast, setCurrenForecast } = useCurrenForecast();

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await fetchWeather();
  }

  const fetchWeather = async () => {
    if (!city) return;

    const forecast = await getWeatherForecastByCityName(city);
    if (forecast) {
      setCurrenForecast(forecast)
    }
  };

  return (
      <main className={styles.main}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <h1 className="text-danger text-center fw-bold mb-4">Weather Forecast</h1>
              <Form className="bg-light p-4 rounded shadow" onSubmit={onFormSubmit}>
                <Row>
                  <Col xs={8} md={9}>
                    <Form.Control

                      type="text"
                      placeholder="Enter city name..."
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mb-3"
                    />
                  </Col>
                  <Col>
                    <Button variant="primary" size={"sm"} type="submit">
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>

              {currentForecast && (
                <div className="mt-5 bg-white p-4 rounded shadow">
                  <h2 className="text-center text-success">{currentForecast.name}</h2>
                  <p className="text-center">{currentForecast.weather[0].description}</p>
                  <h3 className="text-center text-primary">{currentForecast.main.temp}°C</h3>
                  <Link className='link-info' href={"/forecast"}>Weather forecast in {currentForecast.name}</Link>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </main>
  );
}
