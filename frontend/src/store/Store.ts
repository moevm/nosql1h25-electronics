import { configureStore } from '@reduxjs/toolkit';
import userReducer, { initLogin } from './UserSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.dispatch(initLogin(null));
