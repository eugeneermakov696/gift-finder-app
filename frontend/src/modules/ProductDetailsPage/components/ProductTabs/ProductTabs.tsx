import { useState } from 'react';
import styles from './ProductTabs.module.scss';
import type { ExtendedProduct } from '../../ProductDetailsPage';

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, i) => {
    const isFilled = i < Math.round(rating);
    return (
      <span
        key={i}
        className={`${styles.starIcon} ${isFilled ? styles.filled : styles.empty}`}
      />
    );
  });
};

interface ProductTabsProps {
  product: ExtendedProduct;
}

export const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Product Details
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'care' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('care')}
        >
          Care Guide
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'details' && (
          <div className={styles.detailsContent}>
            <ul className={styles.mainList}>
              {product.features.map((feature, idx) => (
                <li key={idx}>
                  <strong>{feature.title}</strong> {feature.description}
                </li>
              ))}
            </ul>
            <ul className={styles.subList}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  {key} - {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'care' && (
          <div className={styles.careContent}>
            {product.care_instructions.map((text, idx) => (
              <p key={idx}>• {text}</p>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className={styles.reviewsContent}>
            {product.reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerAvatar}>
                    <img src={review.reviewer_avatar} alt={review.reviewer_name} />
                  </div>
                  <span className={styles.reviewerName}>{review.reviewer_name}</span>
                </div>

                <div className={styles.reviewRating}>
                  <span className={styles.stars}>{renderStars(review.rating)}</span>
                  <span className={styles.reviewTitle}>{review.title}</span>
                </div>

                <div className={styles.reviewMeta}>
                  <p>
                    Reviewed in {review.location} on {review.date}
                  </p>
                  {review.purchased_options && <p>{review.purchased_options}</p>}
                </div>

                <p className={styles.reviewText}>{review.text}</p>

                {review.image && (
                  <div className={styles.reviewImage}>
                    <img src={review.image} alt="Review attached" />
                  </div>
                )}

                <p className={styles.helpfulText}>
                  {review.helpful_count} people found this helpful
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
