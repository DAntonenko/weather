import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGeolocationData } from './store/geolocationSlice';
import { fetchReverseGeocodingData } from './store/reverseGeocodingSlice';
import { fetchCurrentWeatherData } from './store/currentWeatherSlice';
import { fetchCurrentPollutionData } from './store/currentPollutionSlice';
import { fetchForecastWeatherData } from './store/forecastWeatherSlice';
import countries from 'countries-list';

import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector(state => state.geolocation.geolocationData);

  useEffect(() => {
    console.log('useEffect');
    const fetchActualData = () => {
      dispatch(fetchReverseGeocodingData({latitude, longitude}));
      dispatch(fetchCurrentWeatherData({latitude, longitude}));
      dispatch(fetchCurrentPollutionData({latitude, longitude}));
      dispatch(fetchForecastWeatherData({latitude, longitude}));
    }

    const updateDataAtIntervals = () => {
      setInterval(() => {
        dispatch(fetchCurrentWeatherData({latitude, longitude}));
        dispatch(fetchCurrentPollutionData({latitude, longitude}));
        dispatch(fetchForecastWeatherData({latitude, longitude}));
      }, 900000);
    }

    if (latitude && longitude) {
      fetchActualData();
      updateDataAtIntervals();
    } else {
      var watchID = navigator.geolocation.watchPosition((position) => {
        dispatch(setGeolocationData(position));
      });    
    }
  }, [dispatch, latitude, longitude]);

  const reverseGeocodingData = useSelector(state => state.reverseGeocoding.reverseGeocodingData);
  const currentWeatherData = useSelector(state => state.currentWeather.currentWeatherData);

  const name = reverseGeocodingData ? reverseGeocodingData.name : null;
  const local_names = reverseGeocodingData ? reverseGeocodingData.local_names : null;
  const country = reverseGeocodingData ? reverseGeocodingData.country : null;

  const clouds = currentWeatherData ? currentWeatherData.clouds : null;
  const main = currentWeatherData ? currentWeatherData.main : null;
  const visibility = currentWeatherData ? currentWeatherData.visibility : null;
  const weather = currentWeatherData ? currentWeatherData.weather : null;
  const wind = currentWeatherData ? currentWeatherData.wind : null;
  const windSpeedRounded = wind ? +wind.speed.toFixed(1) : null;

  const pollutionDataList = useSelector(state => state.currentPollution.currentPollutionData.list);
  const pollution = pollutionDataList ? pollutionDataList[0] : null;

  const ms2kmh = ms => ms * 3.6;

  const beaufortWindScale = windSpeed => {
    if (windSpeed < 0.5) return {number: 0, description: 'Calm'};
    else if (windSpeed >= 0.5 && windSpeed <= 1.5) return {number: 1, description: 'Light air'};
    else if (windSpeed >= 1.6 && windSpeed <= 3.3) return {number: 2, description: 'Light breeze'};
    else if (windSpeed >= 3.4 && windSpeed <= 5.4) return {number: 3, description: 'Gentle breeze'};
    else if (windSpeed >= 5.5 && windSpeed <= 7.9) return {number: 4, description: 'Moderate breeze'};
    else if (windSpeed >= 8 && windSpeed <= 10.7) return {number: 5, description: 'Fresh breeze'};
    else if (windSpeed >= 10.8 && windSpeed <= 13.8) return {number: 6, description: 'Strong breeze'};
    else if (windSpeed >= 13.9 && windSpeed <= 17.1) return {number: 7, description: 'Near gale'};
    else if (windSpeed >= 17.2 && windSpeed <= 20.7) return {number: 8, description: 'Gale'};
    else if (windSpeed >= 20.8 && windSpeed <= 24.4) return {number: 9, description: 'Strong gale'};
    else if (windSpeed >= 24.5 && windSpeed <= 28.4) return {number: 10, description: 'Storm'};
    else if (windSpeed >= 28.5 && windSpeed <= 32.6) return {number: 11, description: 'Violent storm'};
    else if (windSpeed >= 32.7) return {number: 12, description: 'Hurricane'};
    else return {number: '?', description: 'Unknown'};
  }

  const aqiDecoder = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor'
  };

  return (
    <div className='App'>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <div className='App-header'>
        {name ? <h2>{name}</h2> : <h2>Current location</h2>}
        {countries && country ? <h2>{countries.countries[country].emoji}</h2> : <p>Loading...</p>}
        {local_names && countries && country ? <h2>{local_names[countries.countries[country].languages[0]]}</h2> : <p>Loading...</p>}
        {main ? <p>Temperature: {Math.round(main.temp)} °C</p> : <p>Loading...</p>}
        {main ? <p>Feels like: {Math.round(main.feels_like)} °C</p> : <p>Loading...</p>}
        {weather ? <p>Weather: {weather[0].main + ' (' + weather[0].description + ')'}</p> : <p>Loading...</p>}
        {clouds ? <p>Cloudiness: {clouds.all} %</p> : <p>Loading...</p>}
        {wind ? <p>Wind: {windSpeedRounded} m/s ({ms2kmh(windSpeedRounded).toFixed(1)} km/h)</p> : <p>Loading...</p>}
        {wind ? <p>Beaufort wind scale: {beaufortWindScale(windSpeedRounded).number} - {beaufortWindScale(windSpeedRounded).description}</p> : <p>Loading...</p>}
        {visibility ? <p>Visibility: {visibility} m</p> : <p>Loading...</p>}
        {main ? <p>Humidity: {main.humidity} %</p> : <p>Loading...</p>}
        {main ? <p>Pressure: {main.pressure} hPa</p> : <p>Loading...</p>}
        {pollution ? <p>Air quality: {aqiDecoder[pollution.main.aqi]}</p> : <p>Loading...</p>}
        {pollution ? <p>CO (Carbon monoxide): {pollution.components.co} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>NO (Nitrogen monoxide): {pollution.components.no} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>NO2 (Nitrogen dioxide): {pollution.components.no2} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>O3 (Ozone): {pollution.components.o3} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>SO2 (Sulphur dioxide): {pollution.components.so2} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>PM2.5 (Fine particles matter): {pollution.components.pm2_5} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>PM10 (Coarse particulate matter): {pollution.components.pm10} μg/m3</p> : <p>Loading...</p>}
        {pollution ? <p>NH3 (Ammonia): {pollution.components.nh3} μg/m3</p> : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default App;
