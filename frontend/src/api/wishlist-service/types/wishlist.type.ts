import type { Product } from "../../gift-service/types/product.type";

export type Wishlist = {
  id: number;
  name: string;
  owner: string;
  items_count: number;
  items: Product[];
};

export type WishlistsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Wishlist[];
};
