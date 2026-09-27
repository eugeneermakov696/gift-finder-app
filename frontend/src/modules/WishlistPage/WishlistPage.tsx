import { useSelector} from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import type { RootState } from '../../store/store';
import { removeGift } from './WishlistSlice';
import styles from './WishlistPage.module.scss';

export const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const savedItems = useSelector((state: RootState) => state.wishlist.items); 

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <span className={styles.heartIcon} /> Favourites
        </div>
        <h1 className={styles.title}>Your Saved Gift Ideas</h1>
        <p className={styles.subtitle}>
          Keep track of the gifts you liked and come back to them anytime.
        </p>
      </div>

      <div className={styles.grid}>
        {savedItems.length === 0 ? (
          <p className={styles.emptyState}>Your wishlist is empty.</p>
        ) : (
          savedItems.map((item) => (
            <div key={item.id} className={styles.card}>
              
              <div className={styles.imageWrapper}>
                <img src={item.imageUrl} alt={item.title} className={styles.image} />
                
                <button 
                  className={styles.favoriteBtn}
                  onClick={() => dispatch(removeGift(item.id))}
                  aria-label="Remove from favorites"
                >
                  <span className={styles.filledHeartIcon} />
                </button>
              </div>

              <div className={styles.details}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <span className={styles.itemPrice}>${item.price}</span>
                
                <a href={item.productUrl} target="_blank" rel="noreferrer" className={styles.amazonBtn}>
                  available at Amazon <span className={styles.amazonIcon}>a</span>
                </a>
                
                <button className={styles.viewDetailsBtn}>View details</button>
              </div>

            </div>
          ))
        )}
      </div>
      
    </div>
  );
};