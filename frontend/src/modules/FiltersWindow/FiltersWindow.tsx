import styles from './FiltersWindow.module.scss';
import { Button } from '../../shared/components/Button';
import { useScrollLock } from '../../shared/hooks/useScrollLock';
import { GIFT_CATEGORIES } from '../../shared/constants/options';
interface PopularGiftsModalProps {
  onClose: () => void;
}

export const FiltersWindow = ({ onClose }: PopularGiftsModalProps) => {
  useScrollLock(true); 

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.innerWrapper}>
          
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <span className={styles.label}>Ready Ideas</span>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <span className={styles.closeIcon} />
              </button>
            </div>
            <h2 className={styles.title}>Curated Gift Guides for Everyone</h2>
            <p className={styles.description}>
              Skip the quiz. Select a recipient and occasion to see our top-rated recommendations.
            </p>
          </div>

          <div className={styles.categoriesContainer}>
            {GIFT_CATEGORIES.map((category, index) => (
              <div key={index} className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <div className={styles.buttonsGrid}>
                  {category.ideas.map((idea, i) => (
                    <Button variant='select' size='large' key={i}>
                      {idea}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};