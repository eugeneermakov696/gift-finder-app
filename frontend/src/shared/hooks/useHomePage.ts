import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { giftService } from '../../api/gift-service/gift.service';
import type { Product } from '../../api/gift-service/types/product.type';
import type { RootState } from '../../store/store';

export const useHomePage = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [popularGifts, setPopularGifts] = useState<Product[]>([]);
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);

  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPopularGifts = async () => {
      try {
        const data = await giftService.getGifts();
        setPopularGifts(data.results.slice(0, 6));
      } catch (error) {
        console.error('Failed to load popular gifts', error);
      } finally {
        setIsLoadingGifts(false);
      }
    };

    fetchPopularGifts();
  }, []);

  return {
    isContactOpen,
    setIsContactOpen,
    isFiltersOpen,
    setIsFiltersOpen,
    popularGifts,
    isLoadingGifts,
    wishlistItems,
    dispatch,
  };
};