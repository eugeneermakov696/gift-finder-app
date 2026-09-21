import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <a href="#home" className={styles.link}>Home</a>
            </li>
            <li>
              <a href="#about" className={styles.link}>About</a>
            </li>
            <li>
              <a href="#howItWorks" className={styles.link}>How it Works</a>
            </li>
            <li>
              <a href="#faq" className={styles.link}>FAQ</a>
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
            <span className={styles.profileIcon} aria-label="Wishlist" />
          </div>
        </NavLink>
      </div>
    </header>
  );
};