import axiosInstance from "../axios";
import type { AxiosInstance } from "axios";
import type { GiftsResponse } from "./types/gifts-response.type";

export type GetGiftsParams = {
  page?: number;
  items_per_page?: number;
  category?: string;
  max_price?: number;
  search?: string;
  sort_by?: string;
  gender_target?: string;
  occasion?: string;
  interests?: string;
  recipient?: string;
};

class GiftService {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  /**
   * Fetch a paginated list of gifts.
   */
  public async getGifts(params?: GetGiftsParams): Promise<GiftsResponse> {
    const response = await this.api.get('gifts/', { params });
    return response.data;
  }
}

export const giftService = new GiftService(axiosInstance);
