import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Header</h1>
      <nav className={styles.navigation}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Home
        </NavLink>
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Wishlist
        </NavLink>
      </nav>
    </header>
  );
};