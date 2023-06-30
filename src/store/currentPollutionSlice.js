import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCurrentPollutionData = createAsyncThunk(
  'currentPollutionData/fetchCurrentPollutionData',
  async function({ lat, lon }, {rejectWithValue}) {
    try {
      const response =
        await fetch(`http://0.0.0.0:8000/current-pollution-coords?lat=${lat}&lon=${lon}`);

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
