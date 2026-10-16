import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import { removeGiftFromWishlist } from '../../store/wishlist/wishlistSlice';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../shared/components/ProductCard';
import type { RootState } from '../../store/store';
import styles from './WishlistPage.module.scss';

export const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const savedItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTextGroup}>
          <div className={styles.breadcrumb}>
            <span className={styles.heartIcon} /> Favourites
          </div>

          <h1 className={styles.title}>Your Saved Gift Ideas</h1>

          <p className={styles.subtitle}>
            Keep track of the gifts you liked and come back to them anytime.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link to="/" className={styles.backLink}>
            Back to home <span className={styles.arrowIcon} aria-label="Right arrow" />
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {savedItems.length === 0 ? (
          <p className={styles.emptyState}>Your favourites list is empty.</p>
        ) : (
          savedItems.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              imageUrl={item.image_url ?? ''}
              description={item.description ?? undefined}
              amazonUrl={item.amazon_url}
              isFavorite={true} 
              onToggleFavorite={() => dispatch(removeGiftFromWishlist(item.id))} 
            />
          ))
        )}
      </div>
    </div>
  );
};