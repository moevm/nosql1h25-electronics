import { configureStore } from '@reduxjs/toolkit';
import userReducer, { initLogin } from './UserSlice';
import productsReducer from './ProductsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.dispatch(initLogin(null));
