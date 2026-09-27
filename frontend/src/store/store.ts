import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../modules/WishlistPage/WishlistSlice';

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
