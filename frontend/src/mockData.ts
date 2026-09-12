import type { Product } from "./modules/WishlistPage/wishlistSlice";

export const mockProducts: Product[] = [
  {
    id: 1,
    productUrl: 'https://www.amazon.com/SukModen-Mens-Dress-Socks-Pairs/dp/B0H31XFH7V/',
    imageUrl: 'https://m.media-amazon.com/images/I/81AibmCrfhL._AC_UL320_.jpg',
    title: 'Mens Dress Socks, 6/12 Pairs Crew Socks for Men',
    rating: 4.6,
    reviewsCount: 123,
    price: 14.99,
    budgetBracket: 'Under $15',
    recipient: 'For Him',
    relationship: 'Partner or Spouse, Coworker',
    interest: 'The Homebody & Cozy Life',
    occasion: 'Birthday, Christmas, Father\'s Day',
    description: 'Premium combed cotton dress socks with seamless toes for all-day office comfort.'
  },
  {
    id: 2,
    productUrl: 'https://www.amazon.com/Willis-Judd-Copper-Bracelet-Magnetic/dp/B0H3MGWPB4/',
    imageUrl: 'https://m.media-amazon.com/images/I/71AdyKiFBdL._AC_UL320_.jpg',
    title: 'Willis Judd Copper Bracelet Magnetic for Men',
    rating: 4.4,
    reviewsCount: 120,
    price: 35.84,
    budgetBracket: '$40 - $100',
    recipient: 'For Him',
    relationship: 'Partner or Spouse, Close Friend',
    interest: 'The Self-Care & Wellness Fan',
    occasion: 'Birthday, Anniversary, Father\'s Day',
    description: 'Elegant magnetic therapy copper bracelet designed to relieve joint stiffness while adding a bold masculine accent.'
  }
];