import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../shared/components/ProductCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store/store';
import { addGiftToWishlist, removeGiftFromWishlist } from '../../store/wishlist/wishlistSlice';
import { useEffect, useState } from 'react';
import { type GetGiftsParams } from '../../api/gift-service/gift.service';
import { Button } from '../../shared/components/Button';
import { LoadingScreen } from '../../shared/components/LoadingScreen';
import styles from './CatalogPage.module.scss';
import { fetchFilteredGifts, setAllFilters } from '../../store/filters/filtersSlice';

// eslint-disable-next-line react-refresh/only-export-components
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

export const CatalogPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const isFromGenerate = location.state?.fromGenerate === true;

  const { results: gifts, isLoading: isReduxLoading } = useAppSelector(
    (state: RootState) => state.filters,
  );
  const wishlistItems = useAppSelector((state: RootState) => state.wishlist.items);

  const [showLoadingScreen, setShowLoadingScreen] = useState(isFromGenerate);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());

    const parsedParams: GetGiftsParams = {
      ...currentParams,
      page: currentParams.page ? Number(currentParams.page) : 1,
      max_price: currentParams.max_price ? Number(currentParams.max_price) : undefined,
    };

    dispatch(setAllFilters(parsedParams));
    dispatch(fetchFilteredGifts(parsedParams));
  }, [searchParams, dispatch]);

  if (showLoadingScreen) {
    return (
      <LoadingScreen
        isLoading={isReduxLoading}
        onCancel={() => setShowLoadingScreen(false)}
        onComplete={() => {
          setShowLoadingScreen(false);
          window.history.replaceState({}, document.title);
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>We Found Some Great Gift Ideas for You</h1>

          <p className={styles.pageSubtitle}>
            Here are personalized recommendations based on your answers.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link to="/find-a-gift">
            <Button variant="primary" size="large">
              Pick again
            </Button>
          </Link>

          <Link to="/" className={styles.backLink}>
            Back to home <span className={styles.arrowIcon} aria-label="Right arrow" />
          </Link>
        </div>
      </header>

      <div className={styles.productsGrid}>
        {gifts.map((product) => {
          const isFavorite = wishlistItems.some((item) => item.id === product.id);

          const handleToggleFavorite = () => {
            if (isFavorite) {
              dispatch(removeGiftFromWishlist(product.id));
            } else {
              dispatch(addGiftToWishlist(product));
            }
          };

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.image_url ?? ''}
              description={product.description ?? undefined}
              amazonUrl={product.amazon_url}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};
