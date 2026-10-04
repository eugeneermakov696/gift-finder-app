import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterModal } from '../RegisterModal';
import { GlowCard } from '../../shared/components/GlowCard';
import { ProfileDashboard } from './components/ProfileDashboard';
import { Button } from '../../shared/components/Button';
import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('giftly_isAuth') === 'true';
  });

  const [loginError, setLoginError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
  };

  const loginInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const savedUser = JSON.parse(localStorage.getItem('giftly_user') || 'null');

    if (!savedUser) {
      setLoginError('Account does not exist. Please create one.');
      return;
    }

    if (savedUser.email === email && savedUser.password === password) {
      localStorage.setItem('giftly_isAuth', 'true');
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid email or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('giftly_isAuth');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleSwitchToLogin = () => {
    setTimeout(() => {
      loginInputRef.current?.focus();
    }, 100);
  };

  if (isLoggedIn) {
    return <ProfileDashboard onLogout={handleLogout} />;
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
          Back to home <span className={styles.arrowIcon} />
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
              <Button variant="primary" size="large" onClick={() => setIsModalOpen(true)}>
                Create Account
              </Button>
              <Link to="/">
                <Button variant="select" size="large">
                  Browse as Guest
                </Button>
              </Link>
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
                ref={loginInputRef}
                placeholder="Email address"
                className={styles.emailInput}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError('');
                }}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={styles.passwordInput}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                required
              />
              <button
                type="button"
                className={`${styles.eyeIcon} ${showPassword ? styles.eyeOpen : ''}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              />
            </div>

            {loginError && <div className={styles.errprMsg}>{loginError}</div>}

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.customCheckbox} />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <Button variant="select" size="extraLarge" type="submit" className={styles.loginBtn}>
              Log In
            </Button>
          </form>
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
            title="Pick Up Where You Left Off"
            description="Sign in anytime and continue exploring all of your saved gift."
            className={styles.card}
          />
        </div>
      </div>
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};
