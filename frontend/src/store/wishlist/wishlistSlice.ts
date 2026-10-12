import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../api/gift-service/types/product.type';
import { wishlistService } from '../../api/wishlist-service/wishlist.service';
import type { RootState } from '../store';

const LOCAL_STORAGE_KEY = 'giftly_guest_wishlist';

interface WishlistState {
  items: Product[];
  wishlistId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  wishlistId: null,
  isLoading: false,
  error: null,
};

const syncLocalStorage = (items: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
};

/**
 * Getting wishlist
 */
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  if (state.auth.user) {
    const response = await wishlistService.getWishlists();

    // If user have wishlist we take first
    if (response.length > 0) {
      const primaryWishlist = response[0];
      return {
        items: primaryWishlist.items,
        wishlistId: primaryWishlist.id,
        isAuth: true,
      };
    }
    return { items: [], wishlistId: null, isAuth: true };
  }

  // if customer is a guest — take out from LocalStorage
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return {
    items: localData ? JSON.parse(localData) : [],
    wishlistId: null,
    isAuth: false,
  };
});

/**
 * Adding a product
 */
export const addGiftToWishlist = createAsyncThunk(
  'wishlist/addGift',
  async (product: Product, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const isAuth = !!state.auth.user;
    const wishlistId = state.wishlist.wishlistId;

    if (isAuth) {
      if (!wishlistId) {
        throw new Error('No active wishlist found for user');
      }
      await wishlistService.addProduct(wishlistId, product.id);
    }

    return { product, isAuth };
  },
);

/**
 * Deleting a product
 */
export const removeGiftFromWishlist = createAsyncThunk(
  'wishlist/removeGift',
  async (productId: number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const isAuth = !!state.auth.user;
    const wishlistId = state.wishlist.wishlistId;

    if (isAuth && wishlistId) {
      await wishlistService.removeProduct(wishlistId, productId);
    }

    return { productId, isAuth };
  },
);

export const WishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Clear wishlist after logout
    clearWishlist(state) {
      state.items = [];
      state.wishlistId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch ---
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.wishlistId = action.payload.wishlistId;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })

      // --- Add ---
      .addCase(addGiftToWishlist.fulfilled, (state, action) => {
        // Preventing duplication
        const exists = state.items.find((item) => item.id === action.payload.product.id);
        if (!exists) {
          state.items.push(action.payload.product);
          if (!action.payload.isAuth) {
            syncLocalStorage(state.items);
          }
        }
      })

      // --- Remove ---
      .addCase(removeGiftFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.productId);
        if (!action.payload.isAuth) {
          syncLocalStorage(state.items);
        }
      });
  },
});

export const { clearWishlist } = WishlistSlice.actions;
export default WishlistSlice.reducer;
