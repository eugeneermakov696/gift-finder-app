import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/';
import { Header } from '../Header';
import styles from './Layout.module.scss';

export const Layout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
