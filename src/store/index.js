import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import geolocationReducer from './geolocationSlice';
import directGeocodingReducer from './directGeocodingSlice';
import reverseGeocodingReducer from './reverseGeocodingSlice';
import currentWeatherReducer from './currentWeatherSlice';
import currentPollutionReducer from './currentPollutionSlice';
import forecastWeatherReducer from './forecastWeatherSlice';
import forecastPollutionReducer from './forecastPollutionSlice';

const rootReducer = combineReducers({
  geolocation: geolocationReducer,
  directGeocoding: directGeocodingReducer,
  reverseGeocoding: reverseGeocodingReducer,
  currentWeather: currentWeatherReducer,
  currentPollution: currentPollutionReducer,
  forecastWeather: forecastWeatherReducer,
  forecastPollution: forecastPollutionReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // pass persistedReducer directly
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
