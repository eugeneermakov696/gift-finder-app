import styles from '../ProductCard/ProductCard.module.scss'; 
import skeletonStyles from './SkeletonCard.module.scss';

interface ProductCardSkeletonProps {
  variant?: 'horizontal' | 'profile';
  className?: string;
}

export const SkeletonCard = ({
  variant = 'horizontal',
  className = '',
}: ProductCardSkeletonProps) => {
  const cardClassName = `${styles.card} ${styles[variant]} ${className}`.trim();

  return (
    <div className={cardClassName}>
      <div className={styles.imageWrapper}>
        <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.image}`} />
      </div>

      <div className={styles.content}>
        <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.title}`} />
        
        {variant !== 'profile' && (
          <>
            <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.descLine}`} />
            <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.descLine} ${skeletonStyles.descLineShort}`} />
          </>
        )}

        <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.price}`} />

        {variant !== 'profile' && (
          <div className={styles.actions}>
            <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.amazonBtn}`} />
            <div className={`${skeletonStyles.skeletonPulse} ${skeletonStyles.detailsBtn}`} />
          </div>
        )}
      </div>
    </div>
  );
};