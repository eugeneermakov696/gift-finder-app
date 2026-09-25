import React, { useEffect, useState } from 'react';
import { giftApi } from '../api/gifts';

export default function GiftGrid() {
  const [gifts, setGifts] = useState([]);
  const [sortBy, setSortBy] = useState('price_low');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    giftApi
      .getGifts(page, sortBy)
      .then((data) => {
        // DRF Pagination nests standard list loops inside a 'results' array key
        setGifts(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page, sortBy]);

  if (loading)
    return (
      <div className="text-center p-10 text-xl font-bold">Loading gifts from PostgreSQL...</div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Sorting Control Header Toolbar Panel */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎁 Amazon Gift Registry</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="price_low">Cheapest Price First</option>
          <option value="price_high">Highest Price First</option>
          <option value="rating">Top Customer Ratings</option>
        </select>
      </div>

      {/* Dynamic Product Catalog Responsive Grid Layout Card System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="border rounded-xl shadow-md overflow-hidden bg-white hover:scale-[1.02] transition-transform"
          >
            <img
              src={gift.image_url}
              alt={gift.title}
              className="w-full h-48 object-cover bg-gray-100"
              onError={(e) => {
                e.target.src = 'https://placeholder.com';
              }}
            />
            <div className="p-4">
              <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                {gift.category}
              </span>
              <h2 className="font-semibold text-gray-900 mt-2 line-clamp-2 h-12">{gift.title}</h2>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-gray-900">${gift.price}</span>
                <a
                  href={gift.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  View Buy Link
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
