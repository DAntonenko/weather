import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchForecastPollutionData = createAsyncThunk(
  'forecastPollutionData/fetchForecastPollutionData',
  async function({ lat, lon }, {rejectWithValue}) {
    try {
      const response =
        await fetch(`http://0.0.0.0:8000/forecast-pollution-coords?lat=${lat}&lon=${lon}`);

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
