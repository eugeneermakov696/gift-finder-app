import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../modules/WishlistPage/wishlistSlice'

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;