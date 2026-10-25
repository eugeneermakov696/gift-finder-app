import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGiftDetails, clearGiftDetails } from '../../store//giftDetails/giftDetailsSlice';
import styles from './ProductDetailsPage.module.scss';

export const ProductDetailsPage = () => {
  const { asin } = useParams<{ asin: string }>();
  const dispatch = useAppDispatch();

  const { gift: product, isLoading, error } = useAppSelector((state) => state.giftDetails);

  useEffect(() => {
    if (asin) {
      dispatch(fetchGiftDetails(asin));
    }
    return () => {
      dispatch(clearGiftDetails());
    };
  }, [asin, dispatch]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.statusMessage}>Loading product details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={`${styles.statusMessage} ${styles.errorMessage}`}>{error}</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <h2 className={styles.statusMessage}>Product not found</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <span>Ready ideas</span> &bull; <span>{product.category || 'Category'}</span> &bull;{' '}
        <span className={styles.current}>View details</span>
      </div>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Product details</h1>
          <p className={styles.subtitle}>{product.title}</p>
        </div>
        <Link to="/" className={styles.backLink}>
          <span>
            Back<span className={styles.desktopText}> to home</span>
          </span>
          <span className={styles.arrowIcon} />
        </Link>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.gallery}>
          <div className={styles.thumbnails}>
            {product.image_url && (
              <div className={`${styles.thumb} ${styles.activeThumb}`}>
                <img src={product.image_url} alt="thumb" className={styles.fullImage} />
              </div>
            )}
          </div>

          <div className={styles.mainImages}>
            <div className={styles.largeImage}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className={styles.fullImage} />
              ) : (
                <div className={styles.imagePlaceholder} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <h2 className={styles.productTitle}>{product.title}</h2>

          <div className={styles.priceRow}>
            <div className={styles.prices}>
              <span className={styles.currentPrice}>${product.price}</span>
              {product.original_price && (
                <span className={styles.oldPrice}>${product.original_price}</span>
              )}
            </div>
            <button className={styles.wishlistBtn}>
              <span className={styles.heartIcon} /> Add to Wish List
            </button>
          </div>

          {product.amazon_url && (
            <div className={styles.actionRow}>
              <a
                href={product.amazon_url}
                target="_blank"
                rel="noreferrer"
                className={styles.amazonBtn}
              >
                Available at Amazon <span className={styles.amazonIcon} />
              </a>
            </div>
          )}

          <div className={styles.promoBox}>
            <p className={styles.promoMain}>
              Enjoy <strong>FREE express & Free Returns</strong> on orders over $35!
            </p>
            <p className={styles.promoSub}>
              Kindly place your order by 6pm on December 22nd for expedited processing
            </p>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabHeaders}>
          <button className={styles.tab}>Product Details</button>
        </div>

        <div className={styles.tabContent}>
          <div className={styles.detailsContent}>
            {product.description ? (
              <p className={styles.descriptionText}>{product.description}</p>
            ) : (
              <p className={styles.emptyState}>
                No detailed description available for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
