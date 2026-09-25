const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const giftApi = {
  /**
   * 1. GET /api/gifts/ - Fetches paginated, sorted, and filtered gifts from PostgreSQL.
   */
  async getGifts(page = 1, sortBy = 'price_low', category = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      sort_by: sortBy,
    });
    if (category) params.append('category', category);

    const response = await fetch(`${BASE_URL}/api/gifts/?${params.toString()}`);
    if (!response.ok) throw new Error('API server request failed');
    return response.json(); // Returns { count, next, previous, results: [...] }
  },

  /**
   * 2. POST /api/gifts/scrape/ - Feeds an Amazon link into the auto-scraper pipeline.
   */
  async scrapeProduct(amazonUrl) {
    const response = await fetch(`${BASE_URL}/api/gifts/scrape/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amazon_url: amazonUrl }),
    });
    if (!response.ok) throw new Error('Scraper processing exception');
    return response.json();
  },

  /**
   * 3. POST /api/wishlists/<id>/manage-item/ - Protected Action. Links a gift to a user's list.
   */
  async manageWishlistItem(wishlistId, presentId, actionType = 'add') {
    // Crucial: Pull your persistent DRF access token key string saved during user login
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${BASE_URL}/api/wishlists/${wishlistId}/manage-item/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`, // <-- Native DRF Security Token Injection Header!
      },
      body: JSON.stringify({
        present_id: presentId,
        action: actionType,
      }),
    });
    return response.json();
  },
};
