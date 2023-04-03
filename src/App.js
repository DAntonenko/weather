import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGeolocationData } from './store/geolocationSlice';
import { fetchDirectGeocodingData } from './store/directGeocodingSlice';
import { fetchReverseGeocodingData } from './store/reverseGeocodingSlice';
import { fetchCurrentWeatherData } from './store/currentWeatherSlice';
import { fetchCurrentPollutionData } from './store/currentPollutionSlice';
import { fetchForecastWeatherData } from './store/forecastWeatherSlice';
import { fetchForecastPollutionData } from './store/forecastPollutionSlice';

// import countries from 'countries-list';
import Select from './components/Select';
import WeatherForDay from './components/WeatherForDay';

import './App.css';

const App = () => {
  const dispatch = useDispatch();

  const date = new Date();

  const [locationMode, setLocationMode] = useState('currentLocation');
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState(null);

  const { latitude, longitude } = useSelector(state => state.geolocation.geolocationData);

  const directGeocodingLatitude = useSelector(state => state.directGeocoding.directGeocodingData && state.directGeocoding.directGeocodingData.lat);
  const directGeocodingLongitude = useSelector(state => state.directGeocoding.directGeocodingData && state.directGeocoding.directGeocodingData.lon);

  useEffect(() => { 
    switch (locationMode) {
      case 'currentLocation':
        latitude && longitude && setCoords({lat: latitude, lon: longitude});
        break;
      case 'selectedLocation':
        directGeocodingLatitude && directGeocodingLongitude && setCoords({lat: directGeocodingLatitude, lon: directGeocodingLongitude});
        break;
      default:
        setCoords(null);
    };    

    console.log('App useEffect: ', location);
    const fetchActualData = () => {
      if (locationMode === 'selectedLocation') dispatch(fetchDirectGeocodingData(location));

      if (locationMode === 'currentLocation') dispatch(fetchReverseGeocodingData(coords));

      if (locationMode === 'currentLocation') dispatch(fetchCurrentWeatherData(coords));
      if (locationMode === 'selectedLocation') dispatch(fetchCurrentWeatherData(location));

      dispatch(fetchCurrentPollutionData(coords));

      if (locationMode === 'currentLocation') dispatch(fetchForecastWeatherData(coords));
      if (locationMode === 'selectedLocation') dispatch(fetchForecastWeatherData(location));

      dispatch(fetchForecastPollutionData(coords));
    };
    
    const updateDataAtIntervals = () => {
      setInterval(() => {
        if (locationMode === 'currentLocation') dispatch(fetchCurrentWeatherData(coords));
        if (locationMode === 'selectedLocation') dispatch(fetchCurrentWeatherData(location));

        dispatch(fetchCurrentPollutionData(coords));
        
        if (locationMode === 'currentLocation') dispatch(fetchForecastWeatherData(coords));
        if (locationMode === 'selectedLocation') dispatch(fetchForecastWeatherData(location));
      }, 900000);
    };

    if (latitude && longitude) {
      fetchActualData();
      updateDataAtIntervals();
    } else {
      var watchID = navigator.geolocation.watchPosition((position) => {
        dispatch(setGeolocationData(position));
      });    
    }
  }, [dispatch, latitude, longitude, directGeocodingLatitude, directGeocodingLongitude, locationMode, location]);

  const fiveDaysForecast = [1, 2, 3, 4, 5].map((numberOfDays, index) => {
    return (
      <WeatherForDay
        date={new Date(date.getTime() + (86400000) * numberOfDays)} // add days to current date; 86400000 is number of milliseconds in a day
        id={numberOfDays + 1}
        size='small'
        type='general'
        key={index}
      />
    )
  });

  return (
    <div className='App w-screen overflow-hidden p-2 flex flex-col items-center font-mukta'>
      <Select
        initialValue={{city: 'Tbilisi', country: 'ge'}}
        options={[
          {city: 'Tbilisi', country: 'ge'},
          {city: 'Batumi', country: 'ge'},
          {city: 'Kutaisi', country: 'ge'},
          {city: 'Kobuleti', country: 'ge'},
          {city: 'Tallinn', country: 'ee'},
          {city: 'Narva', country: 'ee'},
        ]}
        setCity={receivedLocation => {
          if (locationMode !== 'selectedLocation') setLocationMode('selectedLocation');
          console.log('setCity receivedLocation: ', receivedLocation);
          setLocation(receivedLocation);
        }}
      />
      {/* {name ? <h2 className="text-3xl font-bold">{name}</h2> : <h2>Current location</h2>}
      {countries && country ? <h2>{countries.countries[country].emoji}</h2> : <p>Loading...</p>}
      {
        local_names && countries && country ?
        <h2 className="text-3xl font-bold">{local_names[countries.countries[country].languages[0]]}</h2> :
        <p>Loading...</p>
      } */}
      <WeatherForDay
        date={date}
        id={1}
        size='medium'
        type='general'
      />

      <section className='mt-8 w-full flex gap-x-1 overflow-x-scroll'>
        {fiveDaysForecast}
      </section>
      {/* {main ? <p>Temperature: {Math.round(main.temp)} °C</p> : <p>Loading...</p>}
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
      {forecastList
        ? 
        sortForecastListByDate(forecastList).map((dailyWeather, index) => {
          return <p key={index}>Average t° of {getDateFromDtTxt(dailyWeather[0].dt_txt)}: {calculateAverageTemperature(dailyWeather)} °C</p>
        })
        :
        <p>Loading...</p>
      } */}
    </div>
  );
}

export default App;
