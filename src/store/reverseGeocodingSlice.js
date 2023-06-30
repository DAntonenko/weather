import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReverseGeocodingData = createAsyncThunk(
  'reverseGeocodingData/fetchReverseGeocodingData',
  async function({ latitude, longitude }, {rejectWithValue}) {
    try {
      const response =
        await fetch(`http://0.0.0.0:8000/reverse-geocoding?lat=${latitude}&lon=${longitude}`);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const reverseGeocodingData = await response.json();
      return reverseGeocodingData;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reverseGeocodingSlice = createSlice({
    name: 'reverseGeocoding',
    initialState: {
      reverseGeocodingData: null,
      status: null,
      error: null,
    },
    extraReducers: {
      [fetchReverseGeocodingData.pending]: (state) => {
        state.status = 'loading';
        state.error = null;
      },
      [fetchReverseGeocodingData.fulfilled]: (state, action) => {
        state.status = `updated: ${new Date().toString()}`;
        state.reverseGeocodingData = action.payload[0];
        state.error = null;
      },
      [fetchReverseGeocodingData.rejected]: (state, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      },
    },
});

export default reverseGeocodingSlice.reducer;
