import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/Button';
import { ProductCard } from '../../../../shared/components/ProductCard';
import styles from './ProfileDashboard.module.scss';

interface ProfileDashboardProps {
  onLogout: () => void;
}

export const ProfileDashboard = ({ onLogout }: ProfileDashboardProps) => {
  const user = JSON.parse(localStorage.getItem('giftly_user') || '{}');

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}></div>
              <button className={styles.cameraBadge} aria-label="Upload photo">
                <img src="/icons/camera.svg" alt="" />
              </button>
            </div>

            <div className={styles.profileDetails}>
              <h2>{user.fullName || 'Alex Smith'}</h2>
              <p className={styles.email}>{user.email || 'alex.smith@gmail.com'}</p>
              <p className={styles.location}>
                <span className={styles.pinIcon} />
                {user.location || 'San Francisco, CA'}
              </p>
              <Button variant="primary" className={styles.editBtn}>
                Edit Profile
              </Button>
            </div>
          </div>

          <div className={styles.verticalDivider} />

          <div className={styles.authStatusSection}>
            <div className={styles.statusBadge}>
              <span className={styles.dot} /> You're logged in
            </div>
            <p className={styles.signedInText}>
              Signed in as {user.email || 'alex.smith@gmail.com'}
            </p>
            <button onClick={onLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.userOutlineIcon} />
            <h2>Personal Information</h2>
          </div>

          <div className={styles.infoTable}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Full Name</span>
              <span className={styles.infoValue}>{user.fullName || 'Alex Smith'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email Address</span>
              <span className={styles.infoValue}>{user.email || 'alex.smith@gmail.com'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Location</span>
              <span className={styles.infoValue}>{user.location || 'San Francisco, CA'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.favoritesHeader}>
          <h2>My Favourites</h2>
          <Link to="/wishlist" className={styles.viewAllBtn}>
            View All (12) <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>

        <div className={styles.productsGrid}>
          {[1, 2].map((item) => (
            <ProductCard
              key={item}
              title={'ersgg'}
              description={'erag'}
              imageUrl={''}
              isFavorite={false}
              onToggleFavorite={function (): void {
                throw new Error('Function not implemented.');
              }}
            ></ProductCard>
          ))}
        </div>
      </div>
    </div>
  );
};
