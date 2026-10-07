import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/Button';
import styles from './ProfileDashboard.module.scss';
import { useRef, useState } from 'react';
import { EditModal } from '../EditModal';

interface ProfileDashboardProps {
  onLogout: () => void;
}

export const ProfileDashboard = ({ onLogout }: ProfileDashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('giftly_user') || '{}'));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large! Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;

      const updatedUser = { ...user, avatar: base64String };
      setUser(updatedUser);

      localStorage.setItem('giftly_user', JSON.stringify(updatedUser));
    };

    reader.readAsDataURL(file);
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
                onClick={handleCameraClick}
              >
                <span className={styles.cameraIcon} />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className={styles.profileDetails}>
              <h2>{user.fullName || 'Alex Smith'}</h2>
              <p className={styles.email}>{user.email || 'alex.smith@gmail.com'}</p>
              <p className={styles.location}>
                <span className={styles.pinIcon} />
                {user.location || 'San Francisco, CA'}
              </p>
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
              <p className={styles.signedInText}>
                Signed in as {user.email || 'alex.smith@gmail.com'}
              </p>
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
      </div>

      <div className={`${styles.card} ${styles.favoritesCard}`}>
        <h2 className={styles.favoritesTitle}>My Favourites</h2>

        <div className={styles.productsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={styles.tempProductStub}>
              <div className={styles.tempImage}></div>
              <div className={styles.tempInfo}>
                <h4>Fleece Weighted Blanket for Adults</h4>
                <p>$69.99</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/wishlist" className={styles.viewAllBtn}>
          View All (12) <span className={styles.arrowIcon}>→</span>
        </Link>
      </div>
      {isModalOpen && <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
