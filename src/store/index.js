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
import reverseGeocodingReducer from './reverseGeocodingSlice';
import currentWeatherReducer from './currentWeatherSlice';
import currentPollutionReducer from './currentPollutionSlice';
import forecastWeatherReducer from './forecastWeatherSlice';

const rootReducer = combineReducers({
  geolocation: geolocationReducer,
  reverseGeocoding: reverseGeocodingReducer,
  currentWeather: currentWeatherReducer,
  currentPollution: currentPollutionReducer,
  forecastWeather: forecastWeatherReducer,
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
