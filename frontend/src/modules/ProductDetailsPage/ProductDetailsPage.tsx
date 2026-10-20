import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearGiftDetails, fetchGiftDetails } from '../../store/giftDetails/giftDetailsSlice';
//import { ProductTabs } from './components/ProductTabs';
import styles from './ProductDetailsPage.module.scss';

export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  rating: number;
  title: string;
  date: string;
  location: string;
  purchased_options?: string;
  text: string;
  image?: string;
  helpful_count: number;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ExtendedProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count: number;
  amazon_url?: string;
  image_url: string;
  options: {
    colors: string[];
    sizes: string[];
  };
  features: ProductFeature[];
  specifications: Record<string, string>;
  care_instructions: string[];
  reviews: Review[];
}

// eslint-disable-next-line react-refresh/only-export-components
export const mockPantsProduct: ExtendedProduct = {
  id: 102,
  title: 'Hiking Pants Women Quick Dry',
  category: 'Gifts for Mom',
  price: 14.99,
  original_price: 18.88,
  rating: 5,
  reviews_count: 1,
  amazon_url: '#',
  image_url: 'https://m.media-amazon.com/images/I/71p-example.jpg',
  options: {
    colors: ['Gray', 'Black', 'Khaki'],
    sizes: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
  },
  features: [
    {
      title: '【Quick Dry Fabric】:',
      description:
        "These Womens Hiking Pants Are Made With Lightweight Fabric That Repels Light Moisture And Dries Quickly, Helping You Stay Comfortable In Changing Conditions. Designed For Easy Movement And All-Day Wear, They're Perfect For Hiking, Travel, And Everyday Outdoor Adventures.",
    },
    {
      title: '【Straight Fit】:',
      description:
        "Designed For All Body Types, These Women'S Work Pants Feature A Flattering Straight Leg Silhouette That Elongates Your Frame.Give You Best Wear Experience, Made Specifically To Adapt To Your Look And Lifestyle.",
    },
    {
      title: '【Elastic Waist】:',
      description:
        "The Elastic Waistband With An Adjustable Drawstring Gives A Secure Yet Flexible Fit That Adapts To Different Body Types. Designed For All-Day Ease, It Provides Reliable Support And Comfort Whether You're Relaxing Casually Or Staying Active Outdoors. 4 Way Stretch Fabric Increases Mobility And Flexibility.",
    },
    {
      title: '【Versatile For Any Adventure】:',
      description:
        'Womens Wide Leg Pants Are Suitable For Workout, Hiking, Running, Going Out, Mountain Climbing, Travel, Gym, Daily Wear, Casual, And Sports.',
    },
    {
      title: '【Tips】:',
      description:
        'Our Quick Dry Hiking Pants Are Machine Washable (Cold Water, Tumble Dry Low) And Wrinkle-Resistant, They Stay Looking Fresh After Heavy Use.',
    },
  ],
  specifications: {
    'Fabric type': 'Nylon, Spandex',
    'Care instructions': 'Machine Wash',
    'Closure type': 'Pull On',
    'Leg style': 'Wide',
  },
  care_instructions: [
    'Our Quick Dry Hiking Pants Are Machine Washable (Cold Water, Tumble Dry Low) And Wrinkle-Resistant, They Stay Looking Fresh After Heavy Use. Ideal For Work, Hiking, Camping, Or Everyday Wear.',
  ],
  reviews: [
    {
      id: 'r1',
      reviewer_name: 'Om Hun',
      reviewer_avatar: '/placeholder-avatar.jpg',
      rating: 5,
      title: 'best yet hiking pants quick dry!',
      location: 'Canada',
      date: 'July 13, 2026',
      purchased_options: 'Colour Name: Gray | Size: XX-Large',
      text: "I ordered these pants in Gray in 2X-Large, which is my usual/recommended size. I'm about 6'3\" 155-160 and they fit just right. The length is perfect. The material is the thin, stretchy kind that I know will dry fast.",
      image: '/placeholder-review.jpg',
      helpful_count: 2,
    },
  ],
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, i) => {
    const isFilled = i < Math.round(rating);
    return (
      <span key={i} className={`${styles.starIcon} ${isFilled ? styles.filled : styles.empty}`} />
    );
  });
};

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { gift: product, isLoading, error } = useAppSelector((state) => state.giftDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchGiftDetails(id));
    }
    return () => {
      dispatch(clearGiftDetails());
    };
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 style={{ textAlign: 'center', marginTop: '40px' }}>Loading product details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 style={{ textAlign: 'center', marginTop: '40px', color: 'red' }}>{error}</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <h2 style={{ textAlign: 'center', marginTop: '40px' }}>Product not found</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <span>Ready ideas</span> &bull; <span>{product.category || 'Category'}</span> &bull;{' '}
        <span className={styles.current}>View details</span>
      </div>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Product details</h1>
          <p className={styles.subtitle}>{product.title}</p>
        </div>
        <Link to="/" className={styles.backLink}>
          <span>
            Back<span className={styles.desktopText}> to home</span>
          </span>
          <span className={styles.arrowIcon}>&rarr;</span>
        </Link>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.gallery}>
          <div className={styles.thumbnails}>
            {product.image_url && (
              <div className={`${styles.thumb} ${styles.activeThumb}`}>
                <img src={product.image_url} alt="thumb" className={styles.cardImage} />
              </div>
            )}
          </div>

          <div className={styles.mainImages}>
            <div className={styles.largeImage}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#cecece',
                    borderRadius: '12px',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <h2 className={styles.productTitle}>{product.title}</h2>

          <div className={styles.ratingRow}>
            <span className={styles.stars}>{renderStars(product.rating || 0)}</span>
            <span className={styles.ratingScore}>{product.rating || 0}</span>
            <span className={styles.reviewsCount}>({product.reviews_count || 0} review)</span>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.prices}>
              <span className={styles.currentPrice}>${product.price}</span>
              {product.original_price && (
                <span className={styles.oldPrice}>${product.original_price}</span>
              )}
            </div>
            <button className={styles.wishlistBtn}>
              <span className={styles.heartIcon} /> Add to Wish List
            </button>
          </div>

          <div className={styles.promoBox}>
            <p className={styles.promoMain}>
              Enjoy <strong>FREE express & Free Returns</strong> on orders over $35!
            </p>
            <p className={styles.promoSub}>
              Kindly place your order by 6pm on December 22nd for expedited processing
            </p>
          </div>
        </div>
      </div>

      {/* <ProductTabs product={product} /> */}
    </div>
  );
};
