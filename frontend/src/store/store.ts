import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlist/wishlistSlice';
import authReducer from './auth/authSlice';
import filtersReducer from './filters/filtersSlice';

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    auth: authReducer,
    filters: filtersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
