import axiosInstance from "../axios";
import type { AxiosInstance } from "axios";
import type { GiftsResponse } from "./types/gifts-response.type";

class GiftService {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  /**
   * Fetch a paginated list of gifts.
   * TODO for Maksym: double check the name of fields on the backend. Django will snake_case everything.
   * Also there are some fields on the backend that are not in this type. Look at the API documentation.
   */
  public async getGifts(): Promise<GiftsResponse> {
    const response = await this.api.get('gifts/');
    return response.data;
  }
}

export const giftService = new GiftService(axiosInstance);
