import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes  from 'prop-types';

const WeatherForDay = ({ date, id, size, type }) => {
  WeatherForDay.propTypes = {
    date: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'medium']).isRequired,
    type: PropTypes.oneOf(['general', 'main', 'wind', 'air_quality', 'day_forecast']).isRequired,
  };

  const day = date.getDate();
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ][date.getMonth()];

  // function getDateFromDtTxt(dtTxt) {
  //   return dtTxt.slice(0, 10); //The first 10 symbols of dt_txt field represents date
  // }
  
  const currentWeatherData = useSelector(state => state.currentWeather.currentWeatherData);
  const currentPollutionData = useSelector(state => state.currentPollution.currentPollutionData);
  const forecastWeatherData = useSelector(state => state.forecastWeather.forecastWeatherData);
  const forecastPollutionData = useSelector(state => state.forecastPollution.forecastPollutionData);

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

  const data = {};

  function calculateAverage(arr) {
    return (arr.reduce((sum, current) => sum + current, 0)) / arr.length;
  }

  function sortValuesByFrequency(arr) {
    const frequencies = {};
    arr.forEach(value => {
      if (frequencies.hasOwnProperty(value)) {
        frequencies[value] += 1;
      } else {
        frequencies[value] = 1;
      }
    });

    const frequenciesSorted = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
    return Object.fromEntries(frequenciesSorted);
  }

  // const weatherDescription2Icon = {
  //   'clear sky': '01d.png',
  //   'few clouds': '02d.png',
  //   'scattered clouds': '03d.png',
  //   'broken clouds': '04d.png',
  //   'shower rain': '09d.png',
  //   'rain': '10d.png',
  //   'thunderstorm': '11d.pn',
  //   'snow': '13d.png',
  //   'mist': '50d.png'
  // }

  function selectDataSource() {
    const today = new Date();
    // Object.keys(forecastPollutionData).length !== 0)
    if (day === today.getDate() && date.getMonth() === today.getMonth()) { // the date is today

      if (Object.keys(currentWeatherData).length !== 0) { // check if currentWeatherData is not empty object
        data.humidity = currentWeatherData.main.humidity;
        data.pressure = currentWeatherData.main.pressure;
        data.temperature = Math.round(currentWeatherData.main.temp);
        data.weatherDescription = currentWeatherData.weather[0].main;
        data.weatherIcon = currentWeatherData.weather[0].icon;
        data.windSpeedRounded = +currentWeatherData.wind.speed.toFixed(1);
      }

      if (Object.keys(currentPollutionData).length !== 0) { // check if currentPollutionData is not empty object
        data.airQualityIndex = currentPollutionData.list[0].main.aqi;
      }

      if (Object.keys(forecastWeatherData).length !== 0) { // check if forecastWeatherData is not empty object
        data.forecastWeatherList = forecastWeatherData.list.slice(0, 8).map((forecastForThreeHours) => {
          return (
            {
              temperature: Math.round(forecastForThreeHours.main.temp),
              time: forecastForThreeHours.dt_txt.slice(11, 16),
              weatherDescription: currentWeatherData.weather[0].main,
              weatherIcon: forecastForThreeHours.weather[0].icon,
            }
          );
        })
      }
    } else { // the date is not today

      if (Object.keys(forecastWeatherData).length !== 0) { // check if forecastWeatherData is not empty object
        // Filter forecast data according the date received from prop
        const weatherOfTheDay = forecastWeatherData.list.filter(forecastForThreeHours => new Date(forecastForThreeHours.dt_txt).getDate() === date.getDate());

        // Filter daytime forecast data only from weatherOfTheDay
        const daytimeWeather = weatherOfTheDay.filter(forecastForThreeHours => 
          +forecastForThreeHours.dt_txt.slice(11, 13) >= 9 && +forecastForThreeHours.dt_txt.slice(11, 13) <= 21);
        console.log('daytimeWeather: ', daytimeWeather);

        // Filter nighttime forecast data only from weatherOfTheDay
        const nighttimeWeather = weatherOfTheDay.filter(forecastForThreeHours => 
          +forecastForThreeHours.dt_txt.slice(11, 13) < 9);
        console.log('nighttimeWeather: ', nighttimeWeather);

        // Calculate average daily temperature
        const dailyTemperatures = weatherOfTheDay.map(forecastForThreeHours => forecastForThreeHours.main.temp);
        data.temperature = Math.round(calculateAverage(dailyTemperatures));

        // Calculate average daytime temperature
        const daytimeTemperatures = daytimeWeather.map(forecastForThreeHours => forecastForThreeHours.main.temp);
        data.averageDaytimeTemperature = Math.round(calculateAverage(daytimeTemperatures));

        // Calculate average nighttime temperature
        const nighttimeTemperatures = nighttimeWeather.map(forecastForThreeHours => forecastForThreeHours.main.temp);
        data.averageNighttimeTemperature = Math.round(calculateAverage(nighttimeTemperatures));

        // Select icon of the most frequent weather for the day
        const dailyWeatherIcons = weatherOfTheDay.map(forecastForThreeHours => forecastForThreeHours.weather[0].icon);
        data.weatherIcon = Object.keys(sortValuesByFrequency(dailyWeatherIcons))[0];

        // Select description of the most frequent weather for the day
        const dailyWeatherDescriptions = weatherOfTheDay.map(forecastForThreeHours => forecastForThreeHours.weather[0].description);
        data.weatherDescription = Object.keys(sortValuesByFrequency(dailyWeatherDescriptions))[0];
      }
    }
  }
  
  selectDataSource();

  if (size === 'medium') {
    return (
      <section
        id={id}
        className='w-80 px-4 py-8 border-2 border-gray-200 barder-solid rounded-md'
      >
        <h2 className='text-center text-2xl'>{day} {month}</h2>
        <div
          className='flex justify-center items-center gap-10 mt-8'
          tabIndex={id + 1}
        >
          {data.temperature ?
            <p className='text-7xl font-medium'>{data.temperature}<span className='text-2xl align-super'>°C</span></p> : <p>Loading...</p>
          }
          {/* {main ? <p className='text-xl'>Feels like: {Math.round(main.feels_like)} °C</p> : <p>Loading...</p>} */}
          {data.weatherIcon && data.weatherDescription ? 
            <div className='bg-sky-500 rounded-md'>
              <img
                src={`https://openweathermap.org/img/wn/${data.weatherIcon}@2x.png`}
                alt={data.weatherDescription}
              />
            </div>
            :
            <p>Loading...</p>
          }
        </div>
        <div
          className='text-2xl text-center mt-8'
          tabIndex={id + 2}
        >
          {data.windSpeedRounded ?
            <p>{beaufortWindScale(data.windSpeedRounded).description}: {ms2kmh(data.windSpeedRounded).toFixed()} km/h</p> : <p>Loading...</p>
          }
        </div>
        <div
          className='text-2xl text-center mt-2'
          tabIndex={id + 3}
        >
          {data.airQualityIndex ? <p>Air quality: {aqiDecoder[data.airQualityIndex]}</p> : <p>Loading...</p>}
        </div>
        <div
          className='text-2xl text-center mt-2'
          tabIndex={id + 4}
        >
          {data.humidity ? <p>Humidity: {data.humidity} %</p> : <p>Loading...</p>}
          {data.pressure ? <p className='mt-2'>Pressure: {data.pressure} hPa</p> : <p>Loading...</p>}
        </div>
        <div
          className='mt-8 flex gap-x-3 overflow-x-scroll overflow-y-hidden'
          tabIndex={id + 5}
        >
          {
            data.forecastWeatherList ?
            data.forecastWeatherList.map((forecastForThreeHours, index) => {
              return (
                <div
                  className='flex flex-col gap-y-1 items-center'
                  key={index}
                >
                  <time>{forecastForThreeHours.time}</time>
                  <div className='w-11 h-11 flex justify-center items-center bg-sky-500 rounded'>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecastForThreeHours.weatherIcon}.png`}
                      alt={forecastForThreeHours.weatherDescription}
                    />
                  </div>
                  <p>{forecastForThreeHours.temperature}°C</p>
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
  
  if (size === 'small') {
    return (
      <section
        id={id}
        className='flex flex-col items-center w-20 p-1 border-2 border-gray-200 barder-solid rounded-md'
      >
        <h2 className='text-center text-md'>{day} {month.slice(0, 3)}</h2>
        {data.weatherIcon && data.weatherDescription ?
          <div className='w-11 h-11 flex justify-center items-center bg-sky-500 rounded mb-1'>
            <img
              src={`https://openweathermap.org/img/wn/${data.weatherIcon}.png`}
              alt={data.weatherDescription}
            />
          </div>
          :
          <p>n.d.</p>
        }
        {data.averageDaytimeTemperature ?
          <p className='text-4xl font-medium'>{data.averageDaytimeTemperature}<span className='text-sm align-super'>°C</span></p> : <p>n.d.</p>
        }
        <div>
          
          {data.averageNighttimeTemperature ?
            <p className='text-xl font-medium text-gray-500'>{data.averageNighttimeTemperature}<span className=' text-xs align-super'>°C</span></p> : <p>n.d.</p>
          }
        </div>
      </section>
    );
  };
};

export default WeatherForDay;
