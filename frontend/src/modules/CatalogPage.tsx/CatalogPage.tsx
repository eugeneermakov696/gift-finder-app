import { Link, useLocation } from 'react-router-dom';
import { ProductCard } from '../../shared/components/ProductCard';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { addGift, removeGift } from '../WishlistPage/wishlistSlice';
import { useEffect, useState } from 'react';
import { giftService } from '../../api/gift-service/gift.service';
import type { Product } from '../../api/gift-service/types/product.type';
import { Button } from '../../shared/components/Button';
import { LoadingScreen } from '../../shared/components/LoadingScreen';
import styles from './CatalogPage.module.scss';

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

  const isFromGenerate = location.state?.fromGenerate === true;

  const [isLoading, setIsLoading] = useState(isFromGenerate);
  const [, setGifts] = useState<Product[]>([]);
  const savedItems = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await giftService.getGifts();
        setGifts(data.results);
      } catch (error) {
        console.error('Failed to load presents', error);
      } finally {
        if (!isFromGenerate) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [isFromGenerate]);

  if (isLoading) {
    return (
      <LoadingScreen
        onCancel={() => setIsLoading(false)}
        onComplete={() => {
          setIsLoading(false);
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
        {[mockProduct].map((product) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isFavorite = savedItems.some((item: any) => item.id === product.id);

          const handleToggleFavorite = () => {
            if (isFavorite) {
              dispatch(removeGift(product.id));
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dispatch(addGift(product as any));
            }
          };

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description ?? ''}
              imageUrl={product.image_url ?? ''}
              price={15}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};
