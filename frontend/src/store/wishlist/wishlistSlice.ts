import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../api/gift-service/types/product.type';
import { wishlistService } from '../../api/wishlist-service/wishlist.service';
import type { RootState } from '../store';
import { logoutUser } from '../auth/authSlice';

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
 * Merging guest items into the user's backend wishlist upon login
 */
export const mergeGuestWishlist = createAsyncThunk(
  'wishlist/mergeGuestWishlist',
  async () => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localData) {
      return null;
    }

    let guestItems: Product[];
    try {
      guestItems = JSON.parse(localData);
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }

    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }

    // Get the user's primary wishlist from the server
    const wishlists = await wishlistService.getWishlists();
    if (wishlists.length === 0) {
      return null;
    }

    const primaryWishlist = wishlists[0];
    const existingIds = new Set(primaryWishlist.items.map((item) => item.id));

    // Upload items that are not yet on the server
    for (const item of guestItems) {
      if (item && item.id && !existingIds.has(item.id)) {
        try {
          await wishlistService.addProduct(primaryWishlist.id, item.id);
        } catch (error) {
          console.error(`Failed to merge guest item ${item.id} into wishlist:`, error);
        }
      }
    }

    // Clear guest storage after migration
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Refresh wishlist from the backend to get all updated relations
    const updated = await wishlistService.getWishlists();
    if (updated.length > 0) {
      return {
        items: updated[0].items,
        wishlistId: updated[0].id,
      };
    }

    return null;
  },
);

/**
 * Getting wishlist
 */
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  if (state.auth.user) {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      await thunkAPI.dispatch(mergeGuestWishlist());
    }

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
      })

      // --- Merge Guest Wishlist ---
      .addCase(mergeGuestWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeGuestWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items;
          state.wishlistId = action.payload.wishlistId;
        }
      })
      .addCase(mergeGuestWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to merge guest wishlist';
      })

      // --- Logout ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.items = [];
        state.wishlistId = null;
      });
  },
});

export const { clearWishlist } = WishlistSlice.actions;
export default WishlistSlice.reducer;
