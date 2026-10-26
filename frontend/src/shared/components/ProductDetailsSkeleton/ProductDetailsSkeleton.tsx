import skeletonStyles from './ProductDetailsSkeleton.module.scss';
import styles from '../../../modules/ProductDetailsPage/ProductDetailsPage.module.scss';

export const ProductDetailsSkeleton = () => {
  const getClass = (specificClass: string) =>
    `${skeletonStyles.basePulse} ${skeletonStyles[specificClass]}`;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <div className={getClass('breadcrumb')} />
      </div>

      <div className={styles.pageHeader}>
        <div style={{ flex: 1 }}>
          <div className={getClass('pageTitle')} />
          <div className={getClass('pageSubtitle')} />
        </div>
        <div className={styles.backLink} style={{ pointerEvents: 'none' }}>
          <div className={getClass('backLink')} />
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.gallery}>
          <div className={styles.thumbnails}>
            <div className={`${styles.thumb} ${getClass('thumbPulse')}`} />
            <div className={`${styles.thumb} ${getClass('thumbPulse')}`} />
            <div className={`${styles.thumb} ${getClass('thumbPulse')}`} />
          </div>
          <div className={styles.mainImages}>
            <div className={`${styles.largeImage} ${getClass('largeImagePulse')}`} />
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={getClass('productTitle')} />

          <div className={styles.ratingRow}>
            <div className={getClass('rating')} />
          </div>

          <div className={styles.priceRow}>
            <div className={getClass('price')} />
            <div className={getClass('wishlistBtn')} />
          </div>

          <div className={styles.actionRow}>
            <div className={getClass('amazonBtnBlock')} />
          </div>

          <div className={styles.promoBox}>
            <div className={getClass('promoMain')} />
            <div className={getClass('promoSub')} />
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabHeaders}>
          <div className={getClass('tabHeader')} />
        </div>
        <div className={styles.tabContent}>
          <div className={getClass('descLineFull')} />
          <div className={getClass('descLine90')} />
          <div className={getClass('descLine95')} />
          <div className={getClass('descLine60')} />
        </div>
      </div>
    </div>
  );
};
