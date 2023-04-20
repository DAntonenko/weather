import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchForecastWeatherData = createAsyncThunk(
  'forecastWeatherData/fetchForecastWeatherData',
  async function( location, {rejectWithValue}) {
    try {
      let response;
      location.hasOwnProperty('lat') && location.hasOwnProperty('lon') ?
      response = await fetch(`http://0.0.0.0:8000/forecast-weather-coords?lat=${location.lat}&lon=${location.lon}`)
      :
      response = await fetch(`http://0.0.0.0:8000/forecast-weather-city?city=${location.city}&country=${location.country}`);

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
