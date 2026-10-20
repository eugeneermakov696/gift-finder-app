import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { giftService } from '../../api/gift-service/gift.service';
import type { Product } from '../../api/gift-service/types/product.type';

interface GiftDetailsState {
  gift: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GiftDetailsState = {
  gift: null,
  isLoading: false,
  error: null,
};

export const fetchGiftDetails = createAsyncThunk<Product, string | number>(
  'giftDetails/fetchGift',
  async (id, { rejectWithValue }) => {
    try {
      const response = await giftService.getGiftById(id);
      return response as Product;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Failed to load product');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

const giftDetailsSlice = createSlice({
  name: 'giftDetails',
  initialState,
  reducers: {
    clearGiftDetails: (state) => {
      state.gift = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGiftDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGiftDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gift = action.payload; 
      })
      .addCase(fetchGiftDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGiftDetails } = giftDetailsSlice.actions;
export default giftDetailsSlice.reducer;