import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../api/gift-service/types/product.type";

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = { items: [] };

export const WishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addGift(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    removeGift(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
})

export const { addGift, removeGift } = WishlistSlice.actions;
export default WishlistSlice.reducer;