import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCurrentWeatherData = createAsyncThunk(
  'currentWeatherData/fetchCurrentWeatherData',
  async function( location, {rejectWithValue}) {
    try {
      let response;
      location.hasOwnProperty('lat') && location.hasOwnProperty('lon') ?
      response = await fetch(`http://0.0.0.0:8000/current-weather-coords?lat=${location.lat}&lon=${location.lon}`)
      :
      response = await fetch(`http://0.0.0.0:8000/current-weather-city?city=${location.city}&country=${location.country}`);

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
