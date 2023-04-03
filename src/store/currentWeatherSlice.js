import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openweathermapApiKey } from '../constants';

export const fetchCurrentWeatherData = createAsyncThunk(
  'currentWeatherData/fetchCurrentWeatherData',
  async function( location, {rejectWithValue}) {
    try {
      let response;
      location.hasOwnProperty('lat') && location.hasOwnProperty('lon') ?
      response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${openweathermapApiKey}&units=metric`)
      :
      response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location.city},${location.country}&APPID=${openweathermapApiKey}&units=metric`);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const currentWeatherData = await response.json();
      return currentWeatherData;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const currentWeatherSlice = createSlice({
    name: 'currentWeather',
    initialState: {
      currentWeatherData: [],
      status: null,
      error: null,
    },
    extraReducers: {
      [fetchCurrentWeatherData.pending]: (state) => {
        state.status = 'loading';
        state.error = null;
      },
      [fetchCurrentWeatherData.fulfilled]: (state, action) => {
        state.status = `updated: ${new Date().toString()}`;
        state.currentWeatherData = action.payload;
        state.error = null;
      },
      [fetchCurrentWeatherData.rejected]: (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      },
    },
});

export default currentWeatherSlice.reducer;
