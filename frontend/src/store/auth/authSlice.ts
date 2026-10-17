import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../api/auth-service/auth.service';
import { isAxiosError } from 'axios';
import type { User } from '../../api/auth-service/types/user.type';

export interface AuthState {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,
};

interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const response = await authService.register(
        payload.email,
        payload.password,
        payload.confirmPassword,
        payload.fullname,
      );

      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Registration failed');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  },
);

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  try {
    const response = await authService.login(payload.email, payload.password);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
    return thunkAPI.rejectWithValue('An unexpected error occurred');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
  try {
    const response = await authService.getMe();

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to fetch user');
    }
    return thunkAPI.rejectWithValue('An unexpected error occurred');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
  } catch {
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    payload: {
      first_name?: string;
      last_name?: string;
      full_name?: string;
      email?: string;
      password?: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await authService.updateProfile(payload);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to update profile');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  },
);

export const uploadUserAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (file: File, thunkAPI) => {
    try {
      const response = await authService.uploadAvatar(file);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to upload avatar');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  },
);

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatar = action.payload.avatar_url;
          state.user.image_url = action.payload.avatar_url;
        }
      });
  },
});

export default AuthSlice.reducer;
