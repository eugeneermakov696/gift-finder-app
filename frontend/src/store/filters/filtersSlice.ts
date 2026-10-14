import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../api/gift-service/types/product.type';
import { giftService, type GetGiftsParams } from '../../api/gift-service/gift.service';

interface GiftsState {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
  isLoading: boolean;
  error: string | null;
  filters: GetGiftsParams;
}

const initialState: GiftsState = {
  results: [],
  count: 0,
  next: null,
  previous: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
  },
};

export const fetchFilteredGifts = createAsyncThunk(
  'gifts/fetchFiltered',
  async (params: GetGiftsParams) => {
    const response = await giftService.getGifts(params);
    return response;
  },
);

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Action for updaing one exect filter
    setFilter(
      state,
      action: PayloadAction<{ key: keyof GetGiftsParams; value: string | number | undefined }>,
    ) {
      const { key, value } = action.payload;
      state.filters = { ...state.filters, [key]: value };
      if (key !== 'page') {
        state.filters.page = 1;
      }
    },

    setAllFilters(state, action: PayloadAction<GetGiftsParams>) {
      state.filters = action.payload;
    },

    resetFilters(state) {
      state.filters = { page: 1 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredGifts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilteredGifts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchFilteredGifts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch gifts';
      });
  },
});

export const { setFilter, setAllFilters, resetFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
