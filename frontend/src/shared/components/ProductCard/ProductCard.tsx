import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductCard = ({
  title,
  description,
  imageUrl,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) => {
  return (
    <div className={styles.card}>
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
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <button className={styles.amazonBtn}>
            available at Amazon <span className={styles.amazonIcon} aria-label="Amazon"></span>
          </button>
          <Link to={`/product/$id`} className={styles.detailsBtn}>
            <button>View details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
