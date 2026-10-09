import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PixelDrift } from './components/PixelDrift';
import { ContactsWindow } from '../ContactsWindow';
import { FiltersWindow } from '../FiltersWindow';
import { Button } from '../../shared/components/Button';
import styles from './HomePage.module.scss';
import { GlowCard } from '../../shared/components/GlowCard';

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
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const renderGridCard = (imgName: string, title: string, desc: string, w: string, h: string) => (
    <div className={styles.gridCard} key={title}>
      <img
        src={`${import.meta.env.BASE_URL}images/${imgName}`}
        alt={title}
        width={w}
        height={h}
        className={styles.cardImage}
      />
      <div className={styles.cardOverlay}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescr}>{desc}</p>
      </div>
    </div>
  );

  const cardLife = renderGridCard(
    'lifestyle.png',
    'Personality & Lifestyle Matching',
    'Target their actual vibe — from Cozy Homebodies and Tech Geeks to Foodies and Outdoor Explorers.',
    '410',
    '406',
  );
  const cardContext = renderGridCard(
    'context.png',
    'Relationship Context',
    "Calibrate risk and tone for any dynamic — whether it's for a romantic partner, parent, distant cousin, or coworker.",
    '411',
    '271',
  );
  const cardBudget = renderGridCard(
    'budget.png',
    'Strict Budget Limits',
    'Set precise spending brackets from under $15 to $200+. We never push products outside what you plan to spend.',
    '411',
    '271',
  );
  const cardOccasion = renderGridCard(
    'occasion.png',
    'Cover Every Occasion',
    'Curated collections ready for Birthdays, Housewarmings, Anniversaries, Holidays, or just because.',
    '411',
    '404',
  );
  const cardQuality = renderGridCard(
    'quality.png',
    'Verified 4★+ Amazon Quality',
    'We filter out sponsored junk and low-tier knockoffs. Every item comes backed by proven reviews and high ratings.',
    '411',
    '402',
  );
  const cardCheckout = renderGridCard(
    'checkout.png',
    'Frictionless Prime Checkout',
    'Save your favorite ideas with one tap or buy directly on Amazon with standard Prime perks, fast delivery, and simple returns.',
    '411',
    '271',
  );

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.animationWrapper}>
          <PixelDrift />
        </div>

        <div className={styles.heroContent}>
          <h2 className={styles.heroSubtitle}>
            <span className={styles.desktopText}>
              Find a Gift They'll Actually Love — In Under 2 Minutes
            </span>
            <span className={styles.mobileText}>Find a Gift — In Under 2 Minutes</span>
          </h2>

          <div className={styles.buttons}>
            <Link to="/find-a-gift">
              <Button variant="primary" size="large">
                Start Gift Search
              </Button>
            </Link>
            <Button variant="secondary" size="extraLarge" onClick={() => setIsFiltersOpen(true)}>
              Explore Ready Ideas
            </Button>
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
        <p className={styles.description}>
          1. Human-Centered Curation We bypass sponsored clutter on Amazon to match items based on
          authentic recipient personality, hobbies, and your specific budget.
        </p>
        <p className={styles.description}>
          2. Fast or Detailed — You Choose Need something right now? Grab handpicked ideas in 1
          click. Looking for something special? Take our interactive quiz.
        </p>
        <p className={styles.description}>
          3. Free Wishlists & Favorites Never lose a great idea again. Save favorites to custom
          wishlists for birthdays or holidays and share private links with family. if it looks good
          in the design
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
            <Button variant="primary" size="default">
              Start Gift Search
            </Button>
          </Link>
        </div>

        <div className={styles.cards}>
          <GlowCard
            eyebrow="STEP 01"
            title="Share Who You're Celebrating"
            description="Select their age, hobbies, personality, and your budget. It takes less than 60 seconds to complete."
            className={styles.card}
          />
          <GlowCard
            eyebrow="STEP 02"
            title="Get Handpicked Matches"
            description="Our engine cuts out dropship junk and filters top-rated Amazon items matching their specific vibe."
            className={styles.card}
          />
          <GlowCard
            eyebrow="STEP 03"
            title="Buy With Prime Confidence"
            description="Check real price trends and verified reviews, then checkout seamlessly via your existing Amazon account."
            className={styles.card}
          />
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
          Still have questions?{' '}
          <button className={styles.contactLink} onClick={() => setIsContactOpen(true)}>
            Contact us
          </button>{' '}
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

        <div className={`${styles.masonryGrid} ${styles.desktopOnly}`}>
          {cardLife}
          {cardContext}
          {cardBudget}
          {cardOccasion}
          {cardQuality}
          {cardCheckout}
        </div>

        <div className={`${styles.masonryGrid} ${styles.mobileOnly}`}>
          {cardLife}
          {cardContext}
          {cardOccasion}
          {cardBudget}
          {cardQuality}
          {cardCheckout}
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
            <Button variant="primary" size="large">
              Start Gift Search
            </Button>
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
          <Button variant="secondary" size="extraLarge" onClick={() => setIsFiltersOpen(true)}>
            Explore Ready Ideas
          </Button>
        </div>
      </section>

      <section className={styles.giftsSection} id="popularGifts">
        <h2 className={styles.title}>Popular Gifts</h2>
        <h3 className={styles.subtitle}>Trending Gifts People Are Loving Right Now</h3>
        <p className={styles.description}>
          Explore our most popular, editor-vetted Amazon discoveries with verified 4+ star ratings.
        </p>

        <div className={styles.favGrid}>
          <h3>
            Here will be product cards, but first I need real data TO AVOID WASTING time for
            creating FAKE cards.
          </h3>
        </div>
      </section>
      {isContactOpen && <ContactsWindow onClose={() => setIsContactOpen(false)} />}

      {isFiltersOpen && <FiltersWindow onClose={() => setIsFiltersOpen(false)} />}
    </div>
  );
};
