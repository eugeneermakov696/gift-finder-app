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
   * 
   * @param file - The File object selected by the user via <input type="file" />
   * @returns An object containing the new absolute avatar_url
   * 
   * @example
   * const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
   *   const file = event.target.files?.[0];
   *   if (!file) return;
   *   
   *   try {
   *     const response = await authService.uploadAvatar(file);
   *     console.log("New Avatar URL:", response.avatar_url);
   *     // Update local user state (Zustand/Redux/Context) with the new URL
   *   } catch (error) {
   *     console.error("Failed to upload avatar", error);
   *   }
   * };
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
}

export const authService = new AuthService(axiosInstance);