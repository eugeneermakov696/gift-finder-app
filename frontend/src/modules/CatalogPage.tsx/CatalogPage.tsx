import { Link } from 'react-router-dom';
import { ProductCard } from '../../shared/components/ProductCard';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { addGift, removeGift } from '../WishlistPage/wishlistSlice';
import { useEffect, useState } from 'react';
import { getGifts } from '../../api/gifts';
import styles from './CatalogPage.module.scss';

// fake data for product cards
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Basics Dumbbell Hand Weights',
    description: 'Set of 2 dumbbells for resistance training; each dumbbell weighs 3 pounds',
    imageUrl: 'https://via.placeholder.com/200',
  },
  {
    id: 2,
    title: 'Professional Kinesiology Tape',
    description:
      'Waterproof Athletic Sports Tape for Knee, Shoulder, Arm & Back Support | 3-5 Day Adhesion',
    imageUrl: 'https://via.placeholder.com/200',
  },
  {
    id: 3,
    title: 'Amazon Basics Drinking Glasses',
    description:
      '4-PIECE GLASSWARE SET: 311 g drinking glasses (set of 4) for water, soda, and other cold beverages',
    imageUrl: 'https://via.placeholder.com/200',
  },
  {
    id: 4,
    title: 'Cotton Waffle Kitchen Dish Towels',
    description: 'Basics Organic - Ultra Absorbent, Quick Drying, Lint-Free, 38 x 63.5 cm, 6-Pack',
    imageUrl: 'https://via.placeholder.com/200',
  },
];

interface Product {
  id: number;
  productUrl: string;
  imageUrl: string;
  title: string;
  rating: number;
  reviewsCount: number;
  price: number;
  budgetBracket: string;
  recipient: string;
  relationship: string;
  interest: string;
  occasion: string;
  description: string;
}

export const CatalogPage = () => {
  const [gifts, setGifts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  const savedItems = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGifts();
        setGifts(data);
      } catch (error) {
        console.error('Failed to load presents', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [])

  if (isLoading) {
    return <div>Loading...</div>;
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
            <button className={styles.pickAgainBtn}>Pick again</button>
          </Link>
          <Link to="/" className={styles.backLink}>
            Back <span className={styles.arrowIcon} aria-label="Right arrow" />
          </Link>
        </div>
      </header>

      <div className={styles.productsGrid}>
        {gifts.map((product) => {
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
              title={product.title}
              description={product.description}
              imageUrl={product.imageUrl}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};
