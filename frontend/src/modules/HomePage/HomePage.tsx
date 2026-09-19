import { Link } from 'react-router-dom';
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
          <Link to="/find-a-gift">
            <button className={styles.primaryBtn}>Find a gift</button>
          </Link>
          <Link to="/ready-ideas">
          <button className={styles.secondaryBtn}>Ready ideas</button>
          </Link>
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <h2 className={styles.title}>About</h2>
        <h3 className={styles.subtitle}>We help you find the right gift.</h3>
        <p className={styles.description}>
          — makes gift searching easier with filters based on recipient, occasion, budget, and interests.
          We don’t sell products directly. When you choose a gift, you’ll be redirected to (Amazon or another retailer) to complete the purchase.
          Our goal is simple: help you find the right gift faster and with less stress.
        </p>

        <h3 className={styles.subtitle}>Who’s behind?</h3>
        <p className={styles.description}>
          is created by a collaborative team of Project Manager, Frontend Developer, Backend Developer, QA Engineer, Data Analyst, UI/UX Designer, Marketing Specialist,
          DevOps Engineer. working together to make gift discovery simple and useful.
        </p>

        <p>Still have questions? Contact us at [email address].</p>
      </section>

      <section className={styles.howWorksSection} id="howItWorks">
        <h2 className={styles.title}>How it works</h2>
        <h3 className={styles.subtitle}>Three steps to a gift they will love</h3>

        <div className={styles.info}>
          <p className={styles.description}>Answer a few questions and get recommendations that actually fit.</p>
          <button>
            <a href="#learn-more"className={styles.button}>Learn more</a>
          </button>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
        </div>

        <p className={styles.cardsText}>A few quick answers help us narrow down the options and find gifts that truly fit.</p>
      </section>

      <section className={styles.faqSection} id="faq">
        <h2 className={styles.title}>FAQ</h2>
        <p className={styles.description}>
          Quick answers to common questions about finding gifts, shopping through retailers, delivery, and returns.
        </p>

        <hr className={styles.divider} />

        <details className={styles.faqItem}>
          <summary className={styles.faqQuestion}>
            How does it work?

            <div className={styles.downArrowIcon} />
          </summary>
          <div className={styles.faqAnswer}>
            Choose who the gift is for, the occasion, budget, and interests. We'll show gift ideas that match your preferences.
          </div>
        </details>
     
        <hr className={styles.divider} />

        <details className={styles.faqItem}>
          <summary className={styles.faqQuestion}>
            How long does it take?

            <div className={styles.downArrowIcon} />
          </summary>
          <div className={styles.faqAnswer}>
            Finding a gift takes only a few minutes. Use filters and categories to quickly narrow down the options.
          </div>
        </details>

        <hr className={styles.divider} />

        <details className={styles.faqItem}>
          <summary className={styles.faqQuestion}>
            Where can I buy the gift?

            <div className={styles.downArrowIcon} />
          </summary>
          <div className={styles.faqAnswer}>
            When you select a gift, you’ll be redirected to (Amazon or another retailer) where you can view the product and complete your purchase.
          </div>
        </details>

        <hr className={styles.divider} />

        <details className={styles.faqItem}>
          <summary className={styles.faqQuestion}>
            What about delivery?

            <div className={styles.downArrowIcon} />
          </summary>
          <div className={styles.faqAnswer}>
            Delivery options and shipping times depend on the retailer. You can check the details directly on the store’s website before purchasing.
          </div>
        </details>

        <hr className={styles.divider} />

        <details className={styles.faqItem}>
          <summary className={styles.faqQuestion}>
            Can I return a gift?

            <div className={styles.downArrowIcon} />
          </summary>
          <div className={styles.faqAnswer}>
            Returns are handled by the retailer you purchase from. Return policies may vary depending on the store.
          </div>
        </details>

        <hr className={styles.divider} />

        <details className={styles.faqItem}>
          <summary className={styles.faqQuestion}>
            Is — free to use?

            <div className={styles.downArrowIcon} />
          </summary>
          <div className={styles.faqAnswer}>
            Yes. Using — is free. You only pay for the product you choose to purchase from the retailer.
          </div>
        </details>

        <p>Still have questions? Contact us at [email address].</p>
      </section>

      <section className={styles.learnMoreSection} id="learn-more">
        <h2 className={styles.title}>Learn more</h2>
        <h3 className={styles.subtitle}>How Gift Finder Works</h3>
        <p className={styles.description}>
          Choosing the perfect gift can take time. Gift Finder helps you narrow down the options using a few simple details about the person you’re shopping for.
        </p>

        <div className={styles.masonryGrid}>
          <div className={styles.gridCard}>
            <h3>Save time</h3>
            <p>Spend less time searching for the right gift.</p>
          </div>

          <div className={styles.gridCard}>
            <h3>Get more relevant ideas</h3>
            <p>Discover gifts based on the recipient’s real interests.</p>
          </div>

          <div className={styles.gridCard}>
            <h3>Stay within your budget</h3>
            <p>Find options that fit the amount you want to spend.</p>
          </div>

          <div className={styles.gridCard}>
            <h3>Discover new possibilities</h3>
            <p>Explore gifts you may not have considered before.</p>
          </div>

          <div className={styles.gridCard}>
            <h3>Compare with confidence</h3>
            <p>Check prices and reviews before making a decision.</p>
          </div>

          <div className={styles.gridCard}>
            <h3>Find the right gift faster</h3>
            <p>A few simple details help narrow down the options.</p>
          </div>
        </div>

        <h3 className={styles.recSubtitle}>
          How recommendations are created
        </h3>
        <p className={styles.description}>
          Gift Finder uses the information you provide such as the recipient’s age, relationship to you, interests, preferred
          gift type, and budget to narrow down the options and suggest ideas that are more relevant to your needs.
          You can review the recommendations, compare prices and reviews, or adjust your preferences and generate new ideas at any time.
        </p>

        <hr className={styles.divider} />

        <div className={styles.actionRow}>
          <div className={styles.actionText}>
            <h3 className={styles.subtitle}>Not sure where to start?</h3>
            <p className={styles.description}>
              Explore ready-made gift ideas by recipient and occasion, including birthdays, holidays, anniversaries, and more.
            </p>
          </div>
          <Link to="/ready-ideas">
            <button className={styles.secondaryBtn}>Ready Ideas</button>
          </Link>
        </div>

        <hr className={styles.divider} />

        <div className={styles.actionRow}>
          <div className={styles.actionText}>
            <h3 className={styles.subtitle}>Ready to find the right gift?</h3>
            <p className={styles.description}>
              Answer a few simple questions and get personalized gift ideas in just a few steps.
            </p>
          </div>
          <Link to="/find-a-gift">
          <button className={styles.primaryBtn}>Start Finding Gifts</button>
          </Link>
        </div>
      </section>

      <section className={styles.favSection}>
        <h3 className={styles.title}>Favourites</h3>
        <h3 className={styles.subtitle}>YOUR SAVED GIFT IDEAS</h3>
        <p className={styles.description}>Keep track of the gifts you liked and come back to them anytime.</p>

        <div className={styles.favGrid}>
          <article className={styles.favCard}>
            <div className={styles.cardImagePlaceholder}>
            </div>
            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>Fleece Weighted Blanket for Adults</h4>
              <p className={styles.cardDesc}>
                Queen Size; Dual-Sided Ultra Soft Sherpa; 3D Turtle Shell Embossed; Warm Jacquard Flannel Heavy Blankets for Couch and Bed
              </p>
              <div className={styles.cardActions}>
                <button className={styles.amazonBtn}>available at Amazon <span>a</span></button>
                <button className={styles.detailsLink}>View details</button>
              </div>
            </div>
          </article>

          <article className={styles.favCard}>
            <div className={styles.cardImagePlaceholder}></div>
            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>2021 Apple 10.2-inch iPad</h4>
              <p className={styles.cardDesc}>
                Apple iPad, model MK2K3LL/A-cr. Dimensions: 32.77 x 17.27 x 0.74 cm; weight: 485.34 g. ASIN: B09HK12K5M. Requires 1 D battery.
              </p>
              <div className={styles.cardActions}>
                <button className={styles.amazonBtn}>available at Amazon <span>a</span></button>
                <button className={styles.detailsLink}>View details</button>
              </div>
            </div>
          </article>

          <article className={styles.favCard}>
            <div className={styles.cardImagePlaceholder}></div>
            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>2021 Apple 10.2-inch iPad</h4>
              <p className={styles.cardDesc}>
                Apple iPad, model MK2K3LL/A-cr. Dimensions: 32.77 x 17.27 x 0.74 cm; weight: 485.34 g. ASIN: B09HK12K5M. Requires 1 D battery.
              </p>
              <div className={styles.cardActions}>
                <button className={styles.amazonBtn}>available at Amazon <span>a</span></button>
                <button className={styles.detailsLink}>View details</button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};