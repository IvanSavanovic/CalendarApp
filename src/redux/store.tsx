import {configureStore} from '@reduxjs/toolkit';

import calendarSlice from './slices/calendarSlice';

export const store = configureStore({
  reducer: {
    calendra: calendarSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type
export type AppDispatch = typeof store.dispatch;
