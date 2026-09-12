import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  productUrl: string;
  imageUrl: string;
  title: string;
  rating: number;
  reviewsCount: number;
  price: number;
  budgetBracket: string;
  recipient: string;
  relationship: string;
  interest: string;
  occasion: string;
  description: string;
}

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

export const { addGift } = WishlistSlice.actions;
export default WishlistSlice.reducer