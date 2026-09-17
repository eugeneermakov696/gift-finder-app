import { PixelDrift } from '../../shared/components/PixelDrift';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.animationWrapper}>
          <PixelDrift />
        </div>
        <div className={styles.buttons}>
          <button className={styles.primaryBtn}>Find a gift</button>
          <button className={styles.secondaryBtn}>Ready ideas</button>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <h1 className={styles.title}>About</h1>
        <h2 className={styles.subtitle}>We help you find the right gift.</h2>
        <p className={styles.description}>
          — makes gift searching easier with filters based on recipient, occasion, budget, and interests.
          We don’t sell products directly. When you choose a gift, you’ll be redirected to (Amazon or another retailer) to complete the purchase.
          Our goal is simple: help you find the right gift faster and with less stress.
          </p>

          <h2 className={styles.subtitle}>Who’s behind?</h2>
          <p className={styles.description}>
            is created by a collaborative team of Project Manager, Frontend Developer, Backend Developer, QA Engineer, Data Analyst, UI/UX Designer, Marketing Specialist,
            DevOps Engineer. working together to make gift discovery simple and useful.
          </p>

          <p>Still have questions? Contact us at [email address].</p>
      </section>
    </div>
  );
};