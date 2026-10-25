import { Link } from 'react-router-dom';
import styles from './MobileMenu.module.scss';
import { HashLink } from 'react-router-hash-link';

export const MobileMenu = ({ onClose }: { onClose: () => void }) => {
  const scrollWithOffset = (el: HTMLElement) => {
    setTimeout(() => {
      const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
      const yOffset = -120;

      window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

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
              <Link to="/" className={styles.navLink} onClick={scrollToTop}>
                HOME
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/profile" className={styles.navLink} onClick={onClose}>
                PROFILE
              </Link>
            </li>
            <li className={styles.navItem}>
              <HashLink className={styles.navLink} to="/#about" scroll={scrollWithOffset} onClick={onClose}>
                ABOUT
              </HashLink>
            </li>
            <li className={styles.navItem}>
              <HashLink className={styles.navLink} to="/#howItWorks" scroll={scrollWithOffset} onClick={onClose}>
                HOW IT WORKS
              </HashLink>
            </li>
            <li className={styles.navItem}>
              <HashLink className={styles.navLink} to="/#faq" scroll={scrollWithOffset} onClick={onClose}>
                FAQ
              </HashLink>
            </li>
            <li className={styles.navItem}>
              <HashLink className={styles.navLink} to="/#popularGifts" scroll={scrollWithOffset} onClick={onClose}>
                POPULAR GIFTS
              </HashLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};