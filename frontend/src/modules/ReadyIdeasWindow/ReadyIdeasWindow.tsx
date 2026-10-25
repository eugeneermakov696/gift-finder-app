import { Button } from '../../shared/components/Button';
import { useScrollLock } from '../../shared/hooks/useScrollLock';
import { GIFT_CATEGORIES } from '../../shared/constants/options';
import { useNavigate } from 'react-router-dom';
import styles from './ReadyIdeasWindow.module.scss';

interface PopularGiftsModalProps {
  onClose: () => void;
}

export const ReadyIdeasWindow = ({ onClose }: PopularGiftsModalProps) => {
  useScrollLock(true);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const navigate = useNavigate();

  const handleCategoryClick = (recipient: string, occasion: string) => {
    onClose();

    const urlRecipient = recipient.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const urlOccasion = occasion.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    navigate(`/ready-ideas/${urlRecipient}/${urlOccasion}`);
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
                    <Button
                      variant="select"
                      size="large"
                      key={i}
                      className={styles.ideaBtn}
                      onClick={() => handleCategoryClick(category.title, idea)}
                    >
                      {idea.replace(/\s*Gifts$/i, '')}
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
