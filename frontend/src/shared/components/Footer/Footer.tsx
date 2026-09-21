import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
        <Link to="/" className={styles.logo}>
          <img src='./icons/logo.svg' className={styles.logoImg} alt='Giftly logo' />
        </Link>
      </div>

      <div className={styles.rightSection}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <Link to="/privacy-policy" aria-label="Terms & Conditions">
              <p className={styles.link}>Terms & Conditions</p>
            </Link>
            <Link to="/privacy-policy" aria-label="Privacy Policy">
              <p className={styles.link}>Privacy Policy</p>
            </Link>
          </ul>
        </nav>
      </div>
      </div>

      <div className={styles.bottomSection}>
        <p className={styles.footerText}>
          © 2026 Giftly · hello@giftly.com | All Rights Reserved
        </p>
      </div>
    </footer>
  )
};