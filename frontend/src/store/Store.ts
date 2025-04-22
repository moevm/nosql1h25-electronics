import { configureStore } from '@reduxjs/toolkit';
import userReducer, { initLogin } from './UserSlice';
import requestsReducer from './RequestsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.dispatch(initLogin(null));
