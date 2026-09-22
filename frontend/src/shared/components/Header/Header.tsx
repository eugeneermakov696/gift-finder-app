import { Link, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link
                to="/"
                className={styles.link}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Home
              </Link>
            </li>
            <li>
              <HashLink className={styles.link} to="/#about">About</HashLink>
            </li>
            <li>
              <HashLink className={styles.link} to="/#howItWorks">How it works</HashLink>
            </li>
            <li>
              <HashLink className={styles.link} to="/#faq">FAQ</HashLink>
            </li>
          </ul>
        </nav>
      </div>

      <Link to="/" className={styles.logo}>
        <img src='./icons/logo.svg' className={styles.logoImg} alt='Giftly logo' />
      </Link>

      <div className={styles.rightSection}>
        <NavLink
          to="/wishlist"
          aria-label="Wishlist"
        >
          <div className={styles.iconWrapper}>
            <span className={styles.wishlistIcon} aria-label="Wishlist" />
          </div>
        </NavLink>

        <NavLink
          to="/profile"
          aria-label="Profile"
        >
          <div className={styles.iconWrapper}>
            <span className={styles.profileIcon} aria-label="Profile" />
          </div>
        </NavLink>
      </div>
    </header>
  );
};