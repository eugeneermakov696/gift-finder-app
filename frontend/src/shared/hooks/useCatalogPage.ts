import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFilteredGifts, setAllFilters } from '../../store/filters/filtersSlice';
import { addGiftToWishlist, removeGiftFromWishlist } from '../../store/wishlist/wishlistSlice';
import type { GetGiftsParams } from '../../api/gift-service/gift.service';
import type { RootState } from '../../store/store';
import type { Product } from '../../api/gift-service/types/product.type';

export const mockProduct = {
  id: 101,
  title: 'Fleece Weighted Blanket for Adults, 15 lbs, Cozy Sherpa Reversible',
  amazon_url: 'https://www.amazon.com/dp/B08F2QXNG6',
  image_url: 'https://m.media-amazon.com/images/I/81xU9E+9bXL._AC_SL1500_.jpg',
  price: 69.99,
  original_price: 89.99,
  category: 'Home & Kitchen',
  description: 'Experience the ultimate comfort with our premium fleece weighted blanket.',
  age_group: 'Adult',
  gender_target: 'Unisex',
  occasion: "Christmas, Birthday, Mother's Day",
  interests: 'Wellness, Sleep, Home Decor',
  recipient: 'Partner, Parent, Friend',
  is_available: true,
};

export const useCatalogData = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const requestRef = useRef<{ abort: () => void } | null>(null);

  const isFromFilters = searchParams.get('loader') === 'true';
  const [showLoadingScreen, setShowLoadingScreen] = useState(isFromFilters);

  const {
    results: gifts,
    isLoading: isReduxLoading,
    count,
    filters,
  } = useAppSelector((state: RootState) => state.filters);

  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());

    const parsedParams: GetGiftsParams = {
      ...currentParams,
      page: currentParams.page ? Number(currentParams.page) : 1,
      max_price: currentParams.max_price ? Number(currentParams.max_price) : undefined,
    };

    dispatch(setAllFilters(parsedParams));
    requestRef.current = dispatch(fetchFilteredGifts(parsedParams));
  }, [searchParams, dispatch]);

  const cancelGeneration = () => {
    requestRef.current?.abort();
    setShowLoadingScreen(false);
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  const currentPage = filters.page || 1;

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', newPage.toString());

    setSearchParams(currentParams);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (product: Product, isFavorite: boolean) => {
    if (!product) return;

    if (isFavorite) {
      dispatch(removeGiftFromWishlist(product.id));
    } else {
      dispatch(addGiftToWishlist(product));
    }
  };

  return {
    gifts,
    isReduxLoading,
    showLoadingScreen,
    setShowLoadingScreen,
    wishlistItems,
    currentPage,
    totalPages,
    handlePageChange,
    cancelGeneration,
    navigate,
    location,
    handleToggleFavorite,
  };
};