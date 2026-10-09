import axiosInstance from "../axios";

import type { AxiosInstance } from "axios";
import type { AuthResponse } from "./types/auth-response.type";
import type { User } from "./types/user.type";

class AuthService {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  /**
   * Check if user is authenticated and get their data
   * This should be called when the app initializes.
   */
  public async getMe(): Promise<User> {
    const response = await this.api.get('auth/me/');
    return response.data;
  };

  /**
   * Login
   * The backend will attach httponly cookies (access_token, refresh_token)
   */
  public async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('auth/login/', {
      email,
      password,
    });

    return response.data;
  };

  /**
   * Register a new user
   */
  public async register(
    email: string,
    password: string,
    confirmPassword: string,
    fullname: string
  ): Promise<AuthResponse> {
    const response = await this.api.post('auth/register/', {
      email,
      password,
      confirm_password: confirmPassword,
      full_name: fullname,
    });

    return response.data;
  };

  /**
   * Logout
   * The backend will delete the httponly cookies
   */
  public async logout(): Promise<void> {
    await this.api.post('auth/logout/');
  };

  /**
   * Upload an avatar to the backend (which then saves to S3/Cloudflare R2).
   */
  public async uploadAvatar(file: File): Promise<{ detail: string; avatar_url: string | null }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await this.api.post('auth/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  /**
   * Verify the logged-in user's email using a 6-digit code sent to their inbox
   */
  public async verifyEmail(code: string): Promise<{ detail: string }> {
    const response = await this.api.post('auth/verify-email/', { code });
    return response.data;
  };

  /**
   * Resend a new 6-digit verification code to the logged-in user's email
   */
  public async resendVerificationCode(): Promise<{ detail: string }> {
    const response = await this.api.post('auth/verify-email/resend/');
    return response.data;
  };
}

export const authService = new AuthService(axiosInstance);