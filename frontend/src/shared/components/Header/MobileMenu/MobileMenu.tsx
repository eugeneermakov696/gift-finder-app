import { Link } from 'react-router-dom';
import styles from './MobileMenu.module.scss';

export const MobileMenu = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img
              src={`${import.meta.env.BASE_URL}icons/logo.svg`}
              alt="Giftly"
              className={styles.logoImg}
            />
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className={styles.closeIcon}></span>
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/" className={styles.navLink}>
                HOME
              </a>
            </li>
            <li className={styles.navItem}>
              <Link to="/profile" className={styles.navLink}>
                PROFILE
              </Link>
            </li>
            <li className={styles.navItem}>
              <a href="/about" className={styles.navLink}>
                ABOUT
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/how-it-works" className={styles.navLink}>
                HOW IT WORKS
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/faq" className={styles.navLink}>
                FAQ
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/popular" className={styles.navLink}>
                POPULAR GIFTS
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
