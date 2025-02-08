"use client";

import {useRouter} from "next/navigation";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {useCurrenForecast, useInitializeForecast} from "@/stores/current-forecast-store";
import styles from "./forecast.module.scss";

export default function ForecastPage() {
  const router = useRouter();
  const isClient = useInitializeForecast();
  const currentForecast = useCurrenForecast((state) => state.currentForecast);

  if (!isClient) {
    return (
      <Container className={styles.page}>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary"/>
          <p>Loading forecast data...</p>
        </div>
      </Container>
    );
  }

  if (!currentForecast) {
    return (
      <Container className={styles.page}>
        <p className="text-center mt-5">No forecast data available. Try searching for a city.</p>
        <Button variant="primary" className="mt-3" onClick={() => router.push("/")}>
          ← Back to Home
        </Button>
      </Container>
    );
  }

  const {
    name,
    weather,
    main: {temp, feels_like, humidity},
    wind: {speed},
    clouds: {all},
    sys: {sunrise, sunset},
  } = currentForecast;

  return (
    <Container className={styles.page}>
      <Button variant="secondary" className="mt-3 align-self-start" onClick={() => router.push("/")}>
        ← Back to Home
      </Button>

      <div className="text-center w-100 mt-4">
        <h1 className="fw-bold">{name}</h1>
        <p className="fs-4">{weather[0].description}</p>

        <div className={styles.weatherBox}>
          <h2>{temp}°C</h2>
          <p>Feels like: {feels_like}°C</p>
        </div>

        <Row className="mt-4">
          <Col md={4}>
            <InfoBox title="Humidity" value={`${humidity}%`}/>
          </Col>
          <Col md={4}>
            <InfoBox title="Wind Speed" value={`${speed} m/s`}/>
          </Col>
          <Col md={4}>
            <InfoBox title="Cloudiness" value={`${all}%`}/>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <InfoBox title="Sunrise" value={formatTime(sunrise)}/>
          </Col>
          <Col md={6}>
            <InfoBox title="Sunset" value={formatTime(sunset)}/>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

const InfoBox = ({title, value}: { title: string; value: string }) => (
  <div className={styles.infoBox}>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString();
