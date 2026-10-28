import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../api/auth-service/auth.service';
import { isAxiosError } from 'axios';
import { AxiosError } from 'axios';
import type { User } from '../../api/auth-service/types/user.type';

export interface AuthState {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage?: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,
  successMessage: null,
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

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
  old_password?: string;
  new_password?: string;
}

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: UpdateProfilePayload, thunkAPI) => {
    try {
      const response = await authService.updateProfile(payload);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        let errorMessage = data?.detail;
        if (!errorMessage && data && typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          const firstVal = data[firstKey];
          errorMessage = Array.isArray(firstVal) ? firstVal[0] : (typeof firstVal === 'string' ? firstVal : null);
        }
        return thunkAPI.rejectWithValue(errorMessage || 'Failed to update profile');
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

export const deleteAvatar = createAsyncThunk(
  'user/deleteAvatar',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.deleteAvatar();
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Error deleting avatar');
      }
      return rejectWithValue('Unknown error');
    }
  },
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Error sending request');
      }
      return rejectWithValue('Unknown error');
    }
  },
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.resetPasswordConfirm(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Error password reseting');
      }
      return rejectWithValue('Unknown error');
    }
  },
);

export const verifyEmailCode = createAsyncThunk(
  'auth/verifyEmailCode',
  async (code: string, { rejectWithValue }) => {
    try {
      return await authService.verifyEmail(code);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Server error');
      }
      return rejectWithValue('Unknown error');
    }
  },
);

export const resendEmailCode = createAsyncThunk(
  'auth/resendEmailCode',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.resendVerificationCode();
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Sending code error');
      }
      return rejectWithValue('Unknown error');
    }
  },
);

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
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
        state.isAuth = true;
        localStorage.setItem('has_session', 'true');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        localStorage.removeItem('has_session');
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
        localStorage.setItem('has_session', 'true');
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        localStorage.removeItem('has_session');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        localStorage.removeItem('has_session');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuth = false;
        state.user = null;
        localStorage.removeItem('has_session');
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatar = action.payload.avatar_url;
          state.user.image_url = action.payload.avatar_url;
        }
      })
      .addCase(deleteAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.avatar = null;
          state.user.image_url = null;
        }
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmailCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.email_is_confirmed = true;
        }
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'Mail for restoration sent';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default AuthSlice.reducer;
export const { clearError } = AuthSlice.actions;
