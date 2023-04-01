import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openweathermapApiKey } from '../constants';

export const fetchCurrentPollutionData = createAsyncThunk(
  'currentPollutionData/fetchCurrentPollutionData',
  async function(place, {rejectWithValue}) {
    try {
      let response;
      console.log(place);
      place.hasOwnProperty('lat') && place.hasOwnProperty('lon')?
      response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${place.lat}&lon=${place.lon}&appid=${openweathermapApiKey}&units=metric`)
      :
      response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?q=${place.city},${place.country}&APPID=${openweathermapApiKey}&units=metric`);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const currentPollutionData = await response.json();
      return currentPollutionData;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const currentPollutionSlice = createSlice({
    name: 'currentPollution',
    initialState: {
      currentPollutionData: [],
      status: null,
      error: null,
    },
    extraReducers: {
      [fetchCurrentPollutionData.pending]: (state) => {
        state.status = 'loading';
        state.error = null;
      },
      [fetchCurrentPollutionData.fulfilled]: (state, action) => {
        state.status = `updated: ${new Date().toString()}`;
        state.currentPollutionData = action.payload;
        state.error = null;
      },
      [fetchCurrentPollutionData.rejected]: (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      },
    },
});

export default currentPollutionSlice.reducer;
