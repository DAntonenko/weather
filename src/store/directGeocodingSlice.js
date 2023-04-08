import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openweathermapApiKey } from '../constants';

export const fetchDirectGeocodingData = createAsyncThunk(
  'directGeocodingData/fetchDirectGeocodingData',
  async function(place, {rejectWithValue}) {
    try {
      const response =
        await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${place.city}&limit=5&appid=${openweathermapApiKey}&units=metric`);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const directGeocodingData = await response.json();
      return directGeocodingData;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const directGeocodingSlice = createSlice({
    name: 'directGeocoding',
    initialState: {
      directGeocodingData: null,
      status: null,
      error: null,
    },
    extraReducers: {
      [fetchDirectGeocodingData.pending]: (state) => {
        state.status = 'loading';
        state.error = null;
      },
      [fetchDirectGeocodingData.fulfilled]: (state, action) => {
        state.status = `updated: ${new Date().toString()}`;
        state.directGeocodingData = action.payload[0];
        state.error = null;
      },
      [fetchDirectGeocodingData.rejected]: (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      },
    },
});

export default directGeocodingSlice.reducer;
