const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const PORT = 8000;
const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

const app = express();

app.use(cors());

app.get('/current-weather-city', (req, res) => { 
  axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      appid: apiKey,
      q: `${req.query.city},${req.query.country}`,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/current-weather-coords', (req, res) => {
  axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      appid: apiKey,
      q: `lat=${req.query.lat}&lon=${req.query.lon}`,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/forecast-weather-city', (req, res) => {
  axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: {
      appid: apiKey,
      q: `${req.query.city},${req.query.country}`,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/forecast-weather-coords', (req, res) => {
  axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: {
      appid: apiKey,
      q: `lat=${req.query.lat}&lon=${req.query.lon}`,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/current-pollution-coords', (req, res) => {
  axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
    params: {
      appid: apiKey,
      lat: req.query.lat,
      lon: req.query.lon,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/forecast-pollution-coords', (req, res) => {
  axios.get('https://api.openweathermap.org/data/2.5/air_pollution/forecast', {
    params: {
      appid: apiKey,
      lat: req.query.lat,
      lon: req.query.lon,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/direct-geocoding', (req, res) => {
  axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: {
      appid: apiKey,
      q: req.query.q,
      limit: 5,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.get('/reverse-geocoding', (req, res) => {
  axios.get('https://api.openweathermap.org/geo/1.0/reverse', {
    params: {
      appid: apiKey,
      lat: req.query.lat,
      lon: req.query.lon,
      limit: 5,
      units: 'metric'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => error);
});

app.listen(PORT, () => console.log(`Server on ${PORT}`, apiKey));
