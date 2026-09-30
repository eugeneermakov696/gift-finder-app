import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { useState } from 'react';
import { ContactsWindow } from '../../../modules/ContactsWindow';

export const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
        <Link to="/" className={styles.logo}>
          <img src={`${import.meta.env.BASE_URL}icons/logo.svg`} className={styles.logoImg} alt='Giftly logo' />
        </Link>
      </div>

      <div className={styles.rightSection}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <button className={styles.link} onClick={() => setIsContactOpen(true)}>
            Contact
          </button>{' '}
            <Link to="/terms&conditions" aria-label="Terms & Conditions">
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
      {isContactOpen && <ContactsWindow onClose={() => setIsContactOpen(false)} />}
    </footer>
  )
};