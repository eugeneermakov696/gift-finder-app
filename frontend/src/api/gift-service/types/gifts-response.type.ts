import type { Product } from "./product.type";

export type GiftsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
};
