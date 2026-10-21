import { useState } from 'react';
import styles from './ProductTabs.module.scss';
interface ProductTabsProps {
  description?: string | null;
}

export const ProductTabs = ({ description }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<'details'>('details');

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Product Details
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'details' && (
          <div className={styles.detailsContent}>
            {description ? (
              <p className={styles.descriptionText}>{description}</p>
            ) : (
              <p className={styles.emptyState}>
                No detailed description available for this product.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
