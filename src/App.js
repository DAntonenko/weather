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
import FiveDaysForecast from './components/FiveDaysForecast';

import './App.css';

const App = () => {
  const dispatch = useDispatch();

  const date = new Date();

  const [locationMode, setLocationMode] = useState('selectedLocation');
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState(null);
  const [geolocationAvailable, setGeolocationAvailable] = useState(false);

  // Check is geolocation permission granteg or not, and change corresponding state
  navigator.permissions.query({name:'geolocation'}).then(result => {
    console.log('permission: ', result.state);
    if (result.state === 'granted') {
      setGeolocationAvailable(true);
    } else if (result.state === 'denied') {
      setGeolocationAvailable(false);
    }
  });

  console.log('geolocationAvailable: ', geolocationAvailable);

  const { latitude, longitude } = useSelector(state => state.geolocation.geolocationData);

  const directGeocodingLatitude = useSelector(state => state.directGeocoding.directGeocodingData && state.directGeocoding.directGeocodingData.lat);
  const directGeocodingLongitude = useSelector(state => state.directGeocoding.directGeocodingData && state.directGeocoding.directGeocodingData.lon);

  useEffect(() => {

    var watchID = navigator.geolocation.watchPosition((position) => {
      dispatch(setGeolocationData(position));
    });

    if (latitude && longitude) {
      switch (locationMode) {
        case 'currentLocation':
          setCoords({lat: latitude, lon: longitude});
          break;
        case 'selectedLocation':
          directGeocodingLatitude && directGeocodingLongitude && setCoords({lat: directGeocodingLatitude, lon: directGeocodingLongitude});
          break;
        default:
          setCoords(null);
      };
    } else {
      directGeocodingLatitude && directGeocodingLongitude && setCoords({lat: directGeocodingLatitude, lon: directGeocodingLongitude});
    }

    console.log('App useEffect: ', location);
    console.log('permissions: ', PermissionStatus);
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

    // if (latitude && longitude) {
    //   fetchActualData();
    //   updateDataAtIntervals();
    // } else {
    //   if (navigator) {
    //     var watchID = navigator.geolocation.watchPosition((position) => {
    //       dispatch(setGeolocationData(position));
    //     });    
    //   };
    // }

    fetchActualData();
    updateDataAtIntervals();

  // }, [dispatch, latitude, longitude, directGeocodingLatitude, directGeocodingLongitude, locationMode, location]);
  }, [dispatch, geolocationAvailable, directGeocodingLatitude, directGeocodingLongitude, locationMode, location, latitude, longitude]);


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
      <hr className=' w-full border-t-2 border-solid border-gray-300' />
      <section className='mt-8 w-full flex gap-x-2 justify-center overflow-x-auto'>
        <FiveDaysForecast date={date} />
      </section>
    </div>
  );
}

export default App;
