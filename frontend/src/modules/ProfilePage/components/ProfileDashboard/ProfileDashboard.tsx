import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/Button';
import { useEffect, useState } from 'react';
import { EditModal } from '../EditModal';
import { ProductCard } from '../../../../shared/components/ProductCard';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { AvatarUploadModal } from '../AvatarUploadModal';
import { fetchWishlist, removeGiftFromWishlist } from '../../../../store/wishlist/wishlistSlice';
import { resendEmailCode } from '../../../../store/auth/authSlice';
import { SkeletonCard } from '../../../../shared/components/SkeletonCard';
import type { User } from '../../../../api/auth-service/types/user.type';
import type { RootState } from '../../../../store/store';
import styles from './ProfileDashboard.module.scss';

interface ProfileDashboardProps {
  onLogout: () => void;
  user: User;
}

export const ProfileDashboard = ({ onLogout, user }: ProfileDashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');

  const dispatch = useAppDispatch();

  const { items: savedItems, isLoading: isWishlistLoading } = useAppSelector(
    (state: RootState) => state.wishlist,
  );

  const PREVIEW_COUNT = 4;
  const previewItems = savedItems.slice(0, PREVIEW_COUNT);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleVerifyEmail = async () => {
    setIsSendingCode(true);
    setVerifyMessage('');

    try {
      await dispatch(resendEmailCode()).unwrap();
      setVerifyMessage('A verification code has been sent to your email!');

      // modal for code from email
      // setIsVerifyModalOpen(true);
    } catch (error) {
      setVerifyMessage(typeof error === 'string' ? error : 'Error sending code');
    } finally {
      setIsSendingCode(false);
    }
  };

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

              <input type="file" accept="image/*" style={{ display: 'none' }} />
            </div>

            <div className={styles.profileDetails}>
              <h2>
                {user.first_name} {user.last_name}
              </h2>
              <p className={styles.email}>{user.email || user.username}</p>
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
              <p className={styles.signedInText}>Signed in as {user.email || user.username}</p>
            </div>
            <button onClick={onLogout} className={styles.logoutBtn}>
              Log out
            </button>

            {!user.email_is_confirmed && (
              <button
                onClick={handleVerifyEmail}
                disabled={isSendingCode}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-primary-1)',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isSendingCode ? 'not-allowed' : 'pointer',
                  opacity: isSendingCode ? 0.7 : 1,
                }}
              >
                {isSendingCode ? 'Sending...' : 'Verify Email'}
              </button>
            )}
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
                <span className={styles.infoValue}>{user.email || user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.favoritesCard}`}>
        <h2 className={styles.favoritesTitle}>My Favourites</h2>

        {isWishlistLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} variant="profile" />
          ))
        ) : savedItems.length === 0 ? (
          <p className={styles.emptyState}>
            You haven't saved any gifts yet. Browse the catalog and tap the heart to add some!
          </p>
        ) : (
          <div className={styles.productsGrid}>
            {previewItems.map((item) => (
              <ProductCard
                variant="profile"
                key={item.id}
                asin={item.asin}
                title={item.title}
                imageUrl={item.image_url ?? ''}
                description={item.description ?? undefined}
                amazonUrl={item.amazon_url}
                price={Number(item.price)}
                isFavorite
                onToggleFavorite={() => dispatch(removeGiftFromWishlist(item.id))}
              />
            ))}
          </div>
        )}

        {savedItems.length > 0 && (
          <Link to="/wishlist" className={styles.viewAllBtn}>
            View All ({savedItems.length}) <span className={styles.arrowIcon} />
          </Link>
        )}
      </div>
      {isModalOpen && <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      {isAvatarOpen && (
        <AvatarUploadModal isOpen={isAvatarOpen} onClose={() => setIsAvatarOpen(false)} />
      )}
      {verifyMessage && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: verifyMessage.includes('error') ? 'red' : 'green',
          }}
        >
          {verifyMessage}
        </p>
      )}
    </div>
  );
};
