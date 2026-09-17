import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.logo}>
          <img src='./icons/logo.svg' className={styles.logoImg} alt='Giftly logo' />
        </Link>
      </div>

      <div className={styles.rightSection}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#howItWorks">How it Works</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </nav>

        <NavLink
          to="/wishlist"
          aria-label="Wishlist"
        >
          <div className={styles.iconWrapper}>
            <span className={styles.wishlistIcon} aria-label="Wishlist" />
          </div>
        </NavLink>
      </div>
    </header>
  );
};