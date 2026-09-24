import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PixelDrift } from './components/PixelDrift';
import { FirstCard } from './components/Cards';
import { SecondCard } from './components/Cards';
import { ThirdCard } from './components/Cards';
import styles from './HomePage.module.scss';

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={() => setIsOpen(!isOpen)}>
        {question}
        <div className={`${styles.upArrowIcon} ${isOpen ? styles.rotated : ''}`} />
      </button>

      <div className={`${styles.faqAnswerWrapper} ${isOpen ? styles.open : ''}`}>
        <div className={styles.faqAnswerInner}>
          <div className={styles.faqAnswer}>{answer}</div>
        </div>
      </div>
    </div>
  );
};

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.animationWrapper}>
          <PixelDrift />
        </div>

        <div className={styles.heroContent}>
          <h2 className={styles.heroSubtitle}>
            Find a Gift They'll Actually Love — In Under 2 Minutes
          </h2>

          <div className={styles.buttons}>
            <Link to="/find-a-gift">
              <button className={styles.primaryBtn}>Start Gift Search</button>
            </Link>
            <Link to="/ready-ideas">
              <button className={styles.secondaryBtn}>Explore Ready Ideas</button>
            </Link>
          </div>

          <ul className={styles.heroFeatures}>
            <li>• Curated products with a 4★+ rating on Amazon</li>
            <li>• 100% free gift discovery tool</li>
          </ul>
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <h2 className={styles.title}>About</h2>
        <h3 className={styles.subtitle}>
          Why Giftly Is the Smarter Way to Discover Personalized Gifts
        </h3>
        <p className={styles.description}>
          Instead of browsing through endless sponsored listings, our discovery engine filters
          authentic customer feedback, pricing, and interests to deliver curated Amazon gifts you
          can give with confidence.
        </p>
      </section>

      <section className={styles.howWorksSection} id="howItWorks">
        <h2 className={styles.title}>How it works</h2>
        <h3 className={styles.subtitle}>How Our Amazon Gift Finder Works in 3 Simple Steps</h3>

        <div className={styles.info}>
          <p className={styles.description}>
            From zero ideas to a thoughtful present in your Amazon cart in under two minutes.
          </p>
          <Link to="/find-a-gift">
            <button className={styles.primaryBtn}>Start Gift Search</button>
          </Link>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <FirstCard />
          </div>
          <div className={styles.card}>
            <SecondCard />
          </div>
          <div className={styles.card}>
            <ThirdCard />
          </div>
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <h2 className={styles.title}>FAQ</h2>
        <h3 className={styles.subtitle}>
          Everything You Need to Know About Finding Gifts with Giftly
        </h3>
        <p className={styles.description}>
          Have questions about how we select products, pricing, or delivery? We’ve got answers.
        </p>

        <FaqItem
          question="How does Giftly choose and recommend gifts?"
          answer="Giftly matches your recipient's profile (age, relationship, hobbies, and budget) against a hand-curated catalog of high-demand items. We prioritize products with verified 4+ star ratings, genuine positive feedback, and trusted return policies on Amazon."
        />

        <FaqItem
          question="Is Giftly completely free to use?"
          answer="Yes, 100% free. You never pay any fees or markup for using Giftly. When you purchase through our links, we may earn a small affiliate commission from Amazon at no extra cost to you."
        />

        <FaqItem
          question="What’s the difference between «Start Gift Search» and «Explore Ready Ideas»?"
          answer="«Start Gift Search» is an interactive guided quiz that narrows down ideas based on specific hobbies, age, and relationship. «Explore Ready Ideas» is a fast catalog of popular, pre-curated combinations (like Birthday Gifts for Mom or Tech Under $50)."
        />

        <FaqItem
          question="Where do I complete my purchase?"
          answer="Once you pick a gift you like, clicking the link redirects you straight to the official Amazon product listing. You complete your order using your own Amazon account with all your standard payment methods and security."
        />

        <FaqItem
          question="How does shipping and Amazon Prime work?"
          answer="Because your order is handled directly by Amazon, you get all standard shipping benefits. If an item is Prime-eligible and you have Amazon Prime, you’ll receive free 1-to-2 day delivery just like any normal Amazon purchase."
        />

        <FaqItem
          question="Can I return or exchange a gift if they don't like it?"
          answer="Yes. All purchases follow Amazon’s standard 30-day return and replacement policy. Returns and customer service issues are managed directly through your Amazon order dashboard."
        />

        <p className={styles.description}>
          Still have questions?
          <Link to="contact-us" className={styles.contactLink}>
            Contact us
          </Link>
          at [email address].
        </p>
      </section>

      <section className={styles.learnMoreSection} id="features">
        <h2 className={styles.title}>Smart Features</h2>
        <h3 className={styles.subtitle}>How Gift Finder Works</h3>
        <p className={styles.description}>
          Choosing the perfect gift can take time. Gift Finder helps you narrow down the options
          using a few simple details about the person you’re shopping for.
        </p>

        <div className={styles.masonryGrid}>
          <div className={styles.gridCard}>
            <img src="./images/lifestyle.png" alt="Lifestyle" className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>Personality & Lifestyle Matching</h3>
              <p className={styles.cardDescr}>
                Target their actual vibe — from Cozy Homebodies and Tech Geeks to Foodies and
                Outdoor Explorers.
              </p>
            </div>
          </div>

          <div className={styles.gridCard}>
            <img src="./images/context.png" alt="Context" className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>Relationship Context</h3>
              <p className={styles.cardDescr}>
                Calibrate risk and tone for any dynamic — whether it's for a romantic partner,
                parent, distant cousin, or coworker.
              </p>
            </div>
          </div>

          <div className={styles.gridCard}>
            <img src="./images/budget.png" alt="Budget" className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>Strict Budget Limits</h3>
              <p className={styles.cardDescr}>
                Set precise spending brackets from under $15 to $200+. We never push products
                outside what you plan to spend.
              </p>
            </div>
          </div>

          <div className={styles.gridCard}>
            <img src="./images/occasion.png" alt="Occasion" className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>Cover Every Occasion</h3>
              <p className={styles.cardDescr}>
                Curated collections ready for Birthdays, Housewarmings, Anniversaries, Holidays, or
                just because.
              </p>
            </div>
          </div>

          <div className={styles.gridCard}>
            <img src="./images/quality.png" alt="Quality" className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>Verified 4★+ Amazon Quality</h3>
              <p className={styles.cardDescr}>
                We filter out sponsored junk and low-tier knockoffs. Every item comes backed by
                proven reviews and high ratings.
              </p>
            </div>
          </div>

          <div className={styles.gridCard}>
            <img src="./images/checkout.png" alt="Checkout" className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>Frictionless Prime Checkout</h3>
              <p className={styles.cardDescr}>
                Save your favorite ideas with one tap or buy directly on Amazon with standard Prime
                perks, fast delivery, and simple returns.
              </p>
            </div>
          </div>
        </div>

        <h3 className={styles.subtitle}>Find the Perfect Present in Minutes</h3>
        <p className={styles.description}>
          Choose how you want to explore: take the guided questionnaire for a custom match, or dive
          into our popular curated lists
        </p>

        <div className={styles.actionRow}>
          <div className={styles.actionText}>
            <h3 className={styles.subtitle}>Custom Gift Finder</h3>
            <p className={styles.description}>
              Answer a few quick questions about their hobbies, age, and budget for
              hyper-personalized matches.
            </p>
          </div>
          <Link to="/find-a-gift">
            <button className={styles.primaryBtn}>Start Gift Search</button>
          </Link>
        </div>

        <div className={styles.actionRow}>
          <div className={styles.actionText}>
            <h3 className={styles.subtitle}>Browse Ready Collections</h3>
            <p className={styles.description}>
              Short on time? Explore pre-made, top-rated Amazon gift ideas for Mom, Dad, coworkers,
              and holidays.
            </p>
          </div>
          <Link to="/ready-ideas">
            <button className={styles.secondaryBtn}>Explore Ready Ideas</button>
          </Link>
        </div>
      </section>

      <section className={styles.giftsSection}>
        <h2 className={styles.title}>Popular Gifts</h2>
        <h3 className={styles.subtitle}>Trending Gifts People Are Loving Right Now</h3>
        <p className={styles.description}>
          Explore our most popular, editor-vetted Amazon discoveries with verified 4.5+ star
          ratings.
        </p>

        <div className={styles.favGrid}>
          <h3>
            Here will be product cards, but first I need real data TO AVOID WASTING time for
            creating FAKE cards.
          </h3>
        </div>
      </section>
    </div>
  );
};
