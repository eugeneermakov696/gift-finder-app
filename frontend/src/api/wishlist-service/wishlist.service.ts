import axiosInstance from "../axios";
import type { AxiosInstance } from "axios";
import type { WishlistsResponse } from "./types/wishlist.type";

class WishlistService {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  /**
   * Fetch all wishlists for the authenticated user.
   */
  public async getWishlists(): Promise<WishlistsResponse> {
    const response = await this.api.get('wishlists/');

    return response.data;
  }

  /**
   * Add a product to a wishlist.
   */
  public async addProduct(wishlistId: number, presentId: number): Promise<{ status: string; message: string }> {
    const response = await this.api.post(`wishlists/${wishlistId}/manage-item/`, {
      present_id: presentId,
      action: 'add'
    });

    return response.data;
  }

  /**
   * Remove a product from a wishlist.
   */
  public async removeProduct(wishlistId: number, presentId: number): Promise<{ status: string; message: string }> {
    const response = await this.api.post(`wishlists/${wishlistId}/manage-item/`, {
      present_id: presentId,
      action: 'remove'
    });

    return response.data;
  }
}

export const wishlistService = new WishlistService(axiosInstance);
