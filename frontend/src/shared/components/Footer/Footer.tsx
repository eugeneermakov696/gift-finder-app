import { Link, NavLink } from 'react-router-dom';
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
            <li>
              <a href="#howItWorks">How it Works</a>
            </li>
            <NavLink to="/rights" aria-label="Rights">
              <a href="#home">Privacy policy</a>
            </NavLink>
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