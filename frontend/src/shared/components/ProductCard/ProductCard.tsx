import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  imageUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  variant?: 'horizontal' | 'vertical' | 'profile';
  className?: string;
}

export const ProductCard = ({
  id,
  title,
  description,
  price,
  imageUrl,
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
          <img src={imageUrl} alt={title} />
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
            <button className={styles.amazonBtn}>
              available at Amazon <span className={styles.amazonIcon} aria-label="Amazon"></span>
            </button>
            <Link to={`/product/${id}`} className={styles.detailsBtn}>
              View details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};