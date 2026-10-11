import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlist/wishlistSlice';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
