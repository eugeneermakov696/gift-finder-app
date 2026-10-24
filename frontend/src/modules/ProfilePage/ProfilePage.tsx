import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterModal } from '../RegisterModal';
import { GlowCard } from '../../shared/components/GlowCard';
import { ProfileDashboard } from './components/ProfileDashboard';
import { Button } from '../../shared/components/Button';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import {logoutUser } from '../../store/auth/authSlice';
import type { RootState } from '../../store/store';
import styles from './ProfilePage.module.scss';
import AuthFlow from './components/AuthFlow/AuthFlow';

export const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const handleSwitchToLogin = () => {
    setIsModalOpen(false);
  };

  if (isAuth && user) {
    return <ProfileDashboard user={user} onLogout={handleLogout} />;
  }

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
          <span>
            Back<span className={styles.desktopText}> to home</span>
          </span>
          <div className={styles.arrowIcon} />
        </Link>
      </div>

      <div className={styles.authContainer}>
        
        <div className={styles.welcomeSection}>
          <div className={styles.illustrationWrapper}>
            <div className={styles.placeholderBox} />
          </div>

          <div className={styles.welcomeContent}>
            <span className={styles.badge}>Welcome to Giftly</span>
            <h2>Your gifting journey starts here.</h2>
            <p>
              Create an account to save your favorites, keep track of gift ideas, and get
              personalized recommendations for every occasion.
            </p>

            <div className={styles.actionButtons}>
              <Button variant="primary" size="default" onClick={() => setIsModalOpen(true)}>
                Create Account
              </Button>
              <Link to="/">
                <Button variant="select" size="default">
                  Browse as Guest
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.loginSection}>
          <AuthFlow />
        </div>
        
      </div>

      <div className={styles.benefitsSection}>
        <div className={styles.benefitsHeader}>
          <h3>Why create an account?</h3>
          <p>Get the most out of Giftly with a free account.</p>
        </div>

        <div className={styles.benefitsGrid}>
          <GlowCard
            title="Save Your Favorites"
            description="Save your favourite gift ideas and revisit them anytime."
            className={styles.card}
          />
          <GlowCard
            title="Revisit Gift Ideas"
            description="Return to gift ideas you liked without starting your search again."
            className={styles.card}
          />
          <GlowCard
            title="Keep Everything Organized"
            description="Save gift ideas and easily compare your favorites before you decide."
            className={styles.card}
          />
          <GlowCard
            title="Continue Exploring"
            description="Sign in anytime and continue exploring all of your saved gift."
            className={styles.card}
          />
        </div>
      </div>
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};