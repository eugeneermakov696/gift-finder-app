import { Link} from 'react-router-dom';
import { ProductCard } from '../../shared/components/ProductCard';
import { addGiftToWishlist, removeGiftFromWishlist } from '../../store/wishlist/wishlistSlice';
import { Button } from '../../shared/components/Button';
import { LoadingScreen } from '../../shared/components/LoadingScreen';
import { Pagination } from './components/Pagination';
import { useCatalogData } from '../../shared/hooks/useCatalogPage';
import styles from './CatalogPage.module.scss';

export const CatalogPage = () => {
  const {
    gifts,
    isReduxLoading,
    showLoadingScreen,
    setShowLoadingScreen,
    wishlistItems,
    currentPage,
    totalPages,
    handlePageChange,
    dispatch,
  } = useCatalogData();

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
            <Button variant="primary" size="default">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
