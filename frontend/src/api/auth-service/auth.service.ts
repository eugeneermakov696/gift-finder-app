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
}

export const authService = new AuthService(axiosInstance);