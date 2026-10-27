import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { MobileMenu } from './MobileMenu';
import { useActiveSection } from '../../hooks/useActiveSection';
import styles from './Header.module.scss';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  const scrollWithOffset = (el: HTMLElement) => {
    setTimeout(() => {
      const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
      const yOffset = -120;
      window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }, 100);
  };

  const NAV_LINKS = [
    { id: 'about', label: 'About' },
    { id: 'howItWorks', label: 'How it works' },
    { id: 'faq', label: 'FAQ' },
    { id: 'popularGifts', label: 'Popular Gifts' },
  ];

  const activeSection = useActiveSection(NAV_LINKS.map((link) => link.id));

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link
          to="/"
          className={styles.logo}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={`${import.meta.env.BASE_URL}icons/logo.svg`}
            className={styles.logoImg}
            alt="Giftly logo"
          />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <HashLink
                  to={`/#${id}`}
                  scroll={scrollWithOffset}
                  className={`${styles.link} ${isLanding && activeSection === id ? styles.active : ''}`}
                >
                  {label}
                </HashLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <NavLink
          to="/wishlist"
          aria-label="Wishlist"
          className={({ isActive }) => (isActive ? styles.activeIconLink : '')}
        >
          <div className={styles.iconWrapper}>
            <span className={styles.wishlistIcon} aria-label="Wishlist" />
          </div>
        </NavLink>

        <NavLink
          to="/profile"
          aria-label="Profile"
          className={({ isActive }) =>
            `${styles.profileLink} ${isActive ? styles.activeIconLink : ''}`
          }
        >
          <div className={styles.iconWrapper}>
            <span className={styles.profileIcon} aria-label="Profile" />
          </div>
        </NavLink>

        <button
          className={styles.burgerBtn}
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <div className={styles.iconWrapper}>
            <span className={styles.burgerIcon} aria-hidden="true" />
          </div>
        </button>
      </div>

      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
};
