import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useActiveSection } from '../../../hooks/useActiveSection';
import styles from './MobileMenu.module.scss';

export const MobileMenu = ({ onClose }: { onClose: () => void }) => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

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

  const NAV_LINKS = [
    { id: 'about', label: 'ABOUT' },
    { id: 'howItWorks', label: 'HOW IT WORKS' },
    { id: 'faq', label: 'FAQ' },
    { id: 'popularGifts', label: 'POPULAR GIFTS' },
  ];

  const activeSection = useActiveSection(NAV_LINKS.map((link) => link.id));

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
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive && !activeSection ? styles.active : ''}`
                } 
                onClick={scrollToTop}
              >
                HOME
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                } 
                onClick={onClose}
              >
                PROFILE
              </NavLink>
            </li>
            
            {NAV_LINKS.map(({ id, label }) => (
              <li className={styles.navItem} key={id}>
                <HashLink 
                  className={`${styles.navLink} ${isLanding && activeSection === id ? styles.active : ''}`} 
                  to={`/#${id}`} 
                  scroll={scrollWithOffset} 
                  onClick={onClose}
                >
                  {label}
                </HashLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};