import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openweathermapApiKey } from '../constants';

export const fetchCurrentPollutionData = createAsyncThunk(
  'currentPollutionData/fetchCurrentPollutionData',
  async function({ latitude, longitude }, {rejectWithValue}) {
    try {
      // const response = await fetch('http://api.openweathermap.org/data/2.5/weather?q=Tbilisi,ge&APPID=${appid}&units=metric');
      const response =
        await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${openweathermapApiKey}&units=metric`);

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
