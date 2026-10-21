import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  asin: string | number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  amazonUrl?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  variant?: 'horizontal' | 'profile';
  className?: string;
}

export const ProductCard = ({
  asin,
  title,
  description,
  price,
  imageUrl,
  amazonUrl,
  isFavorite,
  onToggleFavorite,
  variant = 'horizontal',
  className = '',
}: ProductCardProps) => {
  const cardClassName = `${styles.card} ${styles[variant]} ${className}`.trim();

  return (
    <div className={cardClassName}>
      <div className={styles.imageWrapper}>
        <button className={styles.favoriteBtn} onClick={onToggleFavorite}>
          {isFavorite ? (
            <span className={styles.filledHeartIcon} />
          ) : (
            <span className={styles.heartIcon} />
          )}
        </button>
        <div className={styles.imagePlaceholder}>
          {imageUrl ? <img src={imageUrl} alt={title} /> : null}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>${price.toFixed(2)}</p>

        {variant !== 'profile' && description && (
          <p className={styles.description}>{description}</p>
        )}

        {variant !== 'profile' && (
          <div className={styles.actions}>
            <a href={amazonUrl} target="_blank" rel="noreferrer" className={styles.amazonBtn}>
              available at Amazon <span className={styles.amazonIcon} aria-label="Amazon"></span>
            </a>
            <Link to={`/product/${asin}`} className={styles.detailsBtn}>
              View details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
