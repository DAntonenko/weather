import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openweathermapApiKey } from '../constants';

export const fetchForecastWeatherData = createAsyncThunk(
  'forecastWeatherData/fetchForecastWeatherData',
  async function( location, {rejectWithValue}) {
    try {
      let response;
      location.hasOwnProperty('lat') && location.hasOwnProperty('lon') ?
      response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${openweathermapApiKey}&units=metric`)
      :
      response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location.city},${location.country}&APPID=${openweathermapApiKey}&units=metric`);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const forecastWeatherData = await response.json();
      return forecastWeatherData;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const forecastWeatherSlice = createSlice({
    name: 'forecastWeather',
    initialState: {
      forecastWeatherData: [],
      status: null,
      error: null,
    },
    extraReducers: {
      [fetchForecastWeatherData.pending]: (state) => {
        state.status = 'loading';
        state.error = null;
      },
      [fetchForecastWeatherData.fulfilled]: (state, action) => {
        state.status = `updated: ${new Date().toString()}`;
        state.forecastWeatherData = action.payload;
        state.error = null;
      },
      [fetchForecastWeatherData.rejected]: (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      },
    },
});

export default forecastWeatherSlice.reducer;
