import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openweathermapApiKey } from '../constants';

export const fetchForecastPollutionData = createAsyncThunk(
  'forecastPollutionData/fetchForecastPollutionData',
  async function({ latitude, longitude }, {rejectWithValue}) {
    try {
      const response =
        await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${openweathermapApiKey}&units=metric`);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const forecastPollutionData = await response.json();
      return forecastPollutionData;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const forecastPollutionSlice = createSlice({
    name: 'forecastPollution',
    initialState: {
      forecastPollutionData: [],
      status: null,
      error: null,
    },
    extraReducers: {
      [fetchForecastPollutionData.pending]: (state) => {
        state.status = 'loading';
        state.error = null;
      },
      [fetchForecastPollutionData.fulfilled]: (state, action) => {
        state.status = `updated: ${new Date().toString()}`;
        state.forecastPollutionData = action.payload;
        state.error = null;
      },
      [fetchForecastPollutionData.rejected]: (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      },
    },
});

export default forecastPollutionSlice.reducer;
