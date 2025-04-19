import { configureStore } from '@reduxjs/toolkit';
import goalReducer from './goalSlice';

export const store = configureStore({
  reducer: {
    goal: goalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 