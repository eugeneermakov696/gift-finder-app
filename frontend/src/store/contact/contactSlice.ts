import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactFormService } from '../../api/contact-form-service/contact-form.service';
import { AxiosError } from 'axios';
import type { ContactFormRequest } from '../../api/contact-form-service/types/contact-form.type';


interface ContactState {
  isLoading: boolean;
  successMessage: string | null;
  error: string | null;
}

const initialState: ContactState = {
  isLoading: false,
  successMessage: null,
  error: null,
};

export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (data: ContactFormRequest, { rejectWithValue }) => {
    try {
      return await contactFormService.sendMessage(data);
    } catch (error) {
          if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
          }
          return rejectWithValue('Unknown error');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearContactState: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'Your message was sent successfully';
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;