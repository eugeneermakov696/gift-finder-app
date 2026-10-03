import { useState } from 'react';
import styles from './ProfilePage.module.scss';
import { Link } from 'react-router-dom';
import { RegisterModal } from '../RegisterModal';

export const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
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
          Back to home <span className={styles.arrowIcon}>→</span>
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
              <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
                Create Account
              </button>
              <button className={styles.guestBtn}>Browse as Guest</button>
            </div>
          </div>
        </div>

        <div className={styles.loginSection}>
          <div className={styles.loginHeader}>
            <h2>Already have an account?</h2>
            <p>Welcome back! Log in to access your favorites, gift lists, and more.</p>
          </div>

          <form className={styles.loginForm} onSubmit={handleLogin}>
            <div className={styles.inputWrapper}>
              <span className={styles.emailIcon} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeIcon}
                aria-label="Toggle password visibility"
              />
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.customCheckbox} />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Log In
            </button>
          </form>
        </div>
      </div>

      <div className={styles.benefitsSection}>
        <div className={styles.benefitsHeader}>
          <h3>Why create an account?</h3>
          <p>Get the most out of Giftly with a free account.</p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <h4>Save Your Favorites</h4>
            <p>
              Keep the gift ideas you love in one place, so you can easily come back to them
              anytime.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <h4>Revisit Gift Ideas</h4>
            <p>Return to gift ideas you liked without starting your search again.</p>
          </div>
          <div className={styles.benefitCard}>
            <h4>Keep Everything Organized</h4>
            <p>Save gift ideas and easily compare your favorites before you decide.</p>
          </div>
          <div className={styles.benefitCard}>
            <h4>Pick Up Where You Left Off</h4>
            <p>Sign in anytime and continue exploring all of your saved gift ideas.</p>
          </div>
        </div>
      </div>
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
