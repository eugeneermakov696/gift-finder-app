const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = {
  // 1. Fetch Paginated and Sorted Amazon Gifts
  async getGifts(page = 1, sortBy = 'price_low') {
    const response = await fetch(`${BASE_URL}/api/gifts/?page=${page}&sort_by=${sortBy}`);
    if (!response.ok) throw new Error('Failed to fetch gifts');
    return response.json(); // Returns metadata and 'results' array
  },

  // 2. Stream an Amazon Link into the Automated Scraper Engine
  async scrapeProduct(amazonUrl) {
    const response = await fetch(`${BASE_URL}/api/gifts/scrape/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amazon_url: amazonUrl }),
    });
    return response.json();
  },

  // 3. Append Products to Wishlists Securely using Tokens
  async addToWishlist(wishlistId, presentId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/wishlists/${wishlistId}/manage-item/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`, // Native DRF Token tracking validation header injection
      },
      body: JSON.stringify({ present_id: presentId, action: 'add' }),
    });
    return response.json();
  },
};
