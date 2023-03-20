import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes, { number }  from 'prop-types';

const WeatherForDay = ({ id }) => {
  WeatherForDay.propTypes = {
    id: number.isRequired,
  };

  const currentWeatherData = useSelector(state => state.currentWeather.currentWeatherData);
  const pollutionDataList = useSelector(state => state.currentPollution.currentPollutionData.list);
  const forecastWeatherData = useSelector(state => state.forecastWeather.forecastWeatherData);
  
  const main = currentWeatherData ? currentWeatherData.main : null;
  const weather = currentWeatherData ? currentWeatherData.weather : null;
  const wind = currentWeatherData ? currentWeatherData.wind : null;
  const windSpeedRounded = wind ? +wind.speed.toFixed(1) : null;
  const pollution = pollutionDataList ? pollutionDataList[0] : null;
  const forecastList = forecastWeatherData.list;

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

  function getDateFromDtTxt(dtTxt) {
    return dtTxt.slice(0, 10); //The first 10 symbols of dt_txt field represents date
  }

  console.log(forecastList.slice(0, 8));

  return (
    <section
      id={id}
      className='w-80 px-4 py-8 border-2 border-black barder-solid rounded-md'
    >
      <h2 className='text-center text-2xl'>30th September</h2>
      <div
        className='flex justify-center items-center gap-2 mt-4'
        tabIndex={id + 1}
      >
        {main ? <p className='text-7xl font-medium'>{Math.round(main.temp)}<span className='text-2xl align-super'>°C</span></p> : <p>Loading...</p>}
        {/* {main ? <p className='text-xl'>Feels like: {Math.round(main.feels_like)} °C</p> : <p>Loading...</p>} */}
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt={`${weather[0].main}`}
        />
      </div>
      <div
        className='text-2xl text-center mt-4'
        tabIndex={id + 2}
      >
        {wind ? <p>{beaufortWindScale(windSpeedRounded).description}: {ms2kmh(windSpeedRounded).toFixed()} km/h</p> : <p>Loading...</p>}
      </div>
      <div
        className='text-2xl text-center mt-2'
        tabIndex={id + 3}
      >
        {pollution ? <p>Air quality: {aqiDecoder[pollution.main.aqi]}</p> : <p>Loading...</p>}
      </div>
      <div
        className='text-2xl text-center mt-2'
        tabIndex={id + 4}
      >
        {main ? <p>Humidity: {main.humidity} %</p> : <p>Loading...</p>}
        {main ? <p className='mt-2'>Pressure: {main.pressure} hPa</p> : <p>Loading...</p>}
      </div>
      <div
        className='mt-2 flex gap-x-3 overflow-x-scroll overflow-y-hidden'
        tabIndex={id + 5}
      >
        {
          forecastList ?
          forecastList.slice(0, 8).map((forecastForThreeHours, index) => {
            return (
              <div
                className='flex flex-col gap-y-1 items-center mt-8'
                key={index}
              >
                <time>{forecastForThreeHours.dt_txt.slice(11, 16)}</time>
                <div className='w-11 h-11 flex justify-center items-center'>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecastForThreeHours.weather[0].icon}.png`}
                    alt={`${forecastForThreeHours.weather[0].main}`}
                  />
                </div>
                <p>{Math.round(forecastForThreeHours.main.temp)}°C</p>
              </div>
            )
          })
          :
          <p>Loading...</p>
        }
      </div>
    </section>
  );
};

export default WeatherForDay;
