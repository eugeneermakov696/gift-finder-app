import { useEffect } from 'react';
import styles from './FiltersWindow.module.scss';

const GIFT_CATEGORIES = [
  {
    title: 'Gifts for Mom',
    ideas: ['Birthday', 'Mother\'s Day', 'Christmas', 'Retirement Gifts', 'Just Because', 'Housewarming Gifts']
  },
  {
    title: 'Gifts for Dad',
    ideas: ['Birthday', 'Father\'s Day Gifts', 'Christmas', 'Retirement Gifts', 'Just Because', 'Housewarming Gifts']
  },
  {
    title: 'Gifts for Boyfriend or Husband',
    ideas: ['Birthday', 'Anniversary', 'Christmas', 'Housewarming Gifts', 'Wedding Gifts', 'Engagement Gifts']
  },
  {
    title: 'Gifts for Girlfriend or Wife',
    ideas: ['Birthday', 'Anniversary', 'Christmas', 'Housewarming Gifts', 'Wedding Gifts', 'Engagement Gifts', 'Graduation Gifts', 'Mother\'s Day', 'Just Because']
  },
  {
    title: 'Gifts for Grandparents',
    ideas: ['Birthday', 'Anniversary', 'Christmas', 'Housewarming Gifts', 'Father\'s Day', 'Mother\'s Day', 'Retirement Gifts', 'Just Because']
  },
  {
    title: 'Gifts for In-Laws',
    ideas: ['Birthday', 'Anniversary', 'Christmas', 'Housewarming Gifts', 'Father\'s Day', 'Mother\'s Day', 'Retirement Gifts', 'Just Because']
  },
  {
    title: 'Gifts for Friends',
    ideas: ['Birthday Gifts for Him', 'Birthday Gifts for Her', 'Christmas', 'Housewarming Gifts', 'Wedding Gifts', 'Engagement Gifts', 'Graduation Gifts', 'Just Because']
  },
  {
    title: 'Gifts for Coworker, Boss and Acquaintance',
    ideas: ['Browse by Occasion']
  }
];

interface PopularGiftsModalProps {
  onClose: () => void;
}

export const FiltersWindow = ({ onClose }: PopularGiftsModalProps) => {
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
                    <button key={i} className={styles.ideaBtn}>
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <button className={styles.submitBtn} onClick={onClose}>
              Show Results
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};