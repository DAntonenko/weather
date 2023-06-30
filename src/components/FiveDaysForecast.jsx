import React from 'react';
import WeatherForDay from './WeatherForDay';
import PropTypes  from 'prop-types';

const FiveDaysForecast = ({ date }) => {
  const days = [1, 2, 3, 4, 5];

  return (
    <>
      {days.map((numberOfDays, index) => (
        <WeatherForDay
          date={new Date(date.getTime() + (86400000) * numberOfDays)} // add days to current date; 86400000 is number of milliseconds in a day
          id={numberOfDays + 1}
          size='small'
          type='general'
          key={index}
        />
      ))}
    </>
  );
};

FiveDaysForecast.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
};

export default FiveDaysForecast;
