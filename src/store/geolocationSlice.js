import { createSlice } from '@reduxjs/toolkit';

const geolocationSlice = createSlice({
    name: 'geolocation',
    initialState: {
      geolocationData: {
        latitude: null,
        longitude: null,
      },
      status: 'initial',
      error: null,
    },
    reducers: {
      setGeolocationData(state, action) {
        state.geolocationData = {
          latitude: action.payload.coords.latitude,
          longitude: action.payload.coords.longitude,
        };
        state.status = `updated: ${new Date(action.payload.timestamp).toString()}`;
      },
    },
});

export const { setGeolocationData } = geolocationSlice.actions;

export default geolocationSlice.reducer;
