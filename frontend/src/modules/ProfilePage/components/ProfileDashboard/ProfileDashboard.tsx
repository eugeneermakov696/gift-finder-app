import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/Button';
import { useState } from 'react';
import { EditModal } from '../EditModal';
import { ProductCard } from '../../../../shared/components/ProductCard';
import { useAppDispatch } from '../../../../store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import type { User } from '../../../../api/auth-service/types/user.type';
import { AvatarUploadModal } from '../AvatarUploadModal';
import { addGiftToWishlist, removeGiftFromWishlist } from '../../../../store/wishlist/wishlistSlice';
import styles from './ProfileDashboard.module.scss';

interface ProfileDashboardProps {
  onLogout: () => void;
  user: User;
}

export const ProfileDashboard = ({ onLogout, user }: ProfileDashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const savedItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.subtitle}>
            Sign in or create an account to save favorites, build gift lists, and get personalized
            recommendations.
          </p>
        </div>
        <Link to="/" className={styles.backLink}>
          Back to home <span className={styles.arrowIcon} />
        </Link>
      </div>

      <div className={styles.topRow}>
        <div className={`${styles.card} ${styles.profileCard}`}>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <div
                className={styles.avatar}
                style={user.avatar ? { backgroundImage: `url(${user.avatar})` } : {}}
              />

              <button
                className={styles.cameraBadge}
                aria-label="Upload photo"
                onClick={() => setIsAvatarOpen(true)}
              >
                <span className={styles.cameraIcon} />
              </button>

              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            <div className={styles.profileDetails}>
              <h2>
                {user.first_name} {user.last_name}
              </h2>
              <p className={styles.email}>{user.username}</p>
              <Button
                variant="primary"
                className={styles.editBtn}
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <div className={styles.verticalDivider} />

          <div className={styles.authStatusSection}>
            <div className={styles.statusBlock}>
              <div className={styles.statusHeader}>
                <span className={styles.dot} /> You're logged in
              </div>
              <p className={styles.signedInText}>Signed in as {user.username}</p>
            </div>
            <button onClick={onLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </div>
        </div>

        <div className={`${styles.card} ${styles.personalInfoCard}`}>
          <span className={styles.userOutlineIcon} />

          <div className={styles.infoContainer}>
            <h2>Personal Information</h2>
            <div className={styles.infoTable}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email Address</span>
                <span className={styles.infoValue}>{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.favoritesCard}`}>
        <h2 className={styles.favoritesTitle}>My Favourites</h2>

        <div className={styles.productsGrid}>
          {[1, 2, 3, 4].map((product) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isFavorite = savedItems.some((item: any) => item.id === product);

            const handleToggleFavorite = () => {
              if (isFavorite) {
                dispatch(removeGiftFromWishlist(product));
              } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dispatch(addGiftToWishlist(product as any));
              }
            };

            return (
              <ProductCard
                variant="profile"
                key={product}
                id={product}
                title="Hiking Pants Women Quick Wide Leg"
                description="Hiking pants are made with Lighweight Fabric that repels light moisture and dries quicle."
                imageUrl=""
                price={15}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </div>

        <Link to="/wishlist" className={styles.viewAllBtn}>
          View All (12) <span className={styles.arrowIcon} />
        </Link>
      </div>
      {isModalOpen && <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      {isAvatarOpen && (
        <AvatarUploadModal isOpen={isAvatarOpen} onClose={() => setIsAvatarOpen(false)} />
      )}
    </div>
  );
};
