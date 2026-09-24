import styles from './ProductCard.module.scss';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export const ProductCard = ({ title, description, imageUrl }: ProductCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <button className={styles.favoriteBtn} aria-label="Add to favorites">
          ♡
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
          <button className={styles.detailsBtn}>View details</button>
        </div>
      </div>
    </div>
  );
};
