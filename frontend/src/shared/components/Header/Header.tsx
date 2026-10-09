import { Link, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import styles from './Header.module.scss';

export const Header = () => {
  const scrollWithOffset = (el: HTMLElement) => {
    setTimeout(() => {
      const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
      const yOffset = -120;

      window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link
          to="/"
          className={styles.logo}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={`${import.meta.env.BASE_URL}icons/logo.svg`} className={styles.logoImg} alt="Giftly logo" />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <HashLink className={styles.link} to="/#about" scroll={scrollWithOffset}>
                About
              </HashLink>
            </li>
            <li>
              <HashLink className={styles.link} to="/#howItWorks" scroll={scrollWithOffset}>
                How it works
              </HashLink>
            </li>
            <li>
              <HashLink className={styles.link} to="/#faq" scroll={scrollWithOffset}>
                FAQ
              </HashLink>
            </li>
            <li>
              <HashLink className={styles.link} to="/#popularGifts" scroll={scrollWithOffset}>
                Popular Gifts
              </HashLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <NavLink to="/wishlist" aria-label="Wishlist">
          <div className={styles.iconWrapper}>
            <span className={styles.wishlistIcon} aria-label="Wishlist" />
          </div>
        </NavLink>

        <NavLink to="/profile" aria-label="Profile" className={styles.profileLink}>
          <div className={styles.iconWrapper}>
            <span className={styles.profileIcon} aria-label="Profile" />
          </div>
        </NavLink>

        <button className={styles.burgerBtn} aria-label="Open menu" onClick={() => console.log('Open menu')}>
          <div className={styles.iconWrapper}>
            <span className={styles.burgerIcon} aria-hidden="true" />
          </div>
        </button>
      </div>
    </header>
  );
};