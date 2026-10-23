import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PixelDrift } from './components/PixelDrift';
import { ContactsWindow } from '../ContactsWindow';
import { ReadyIdeasWindow } from '../ReadyIdeasWindow';
import { Button } from '../../shared/components/Button';
import { GlowCard } from '../../shared/components/GlowCard';
import { addGiftToWishlist, removeGiftFromWishlist } from '../../store/wishlist/wishlistSlice';
import { ProductCard } from '../../shared/components/ProductCard';
import { useHomePage } from '../../shared/hooks/useHomePage';
import {
  DESKTOP_ORDER,
  FEATURES_DATA,
  MOBILE_ORDER,
  type FeatureCardProps,
} from '../../shared/constants/homePage';
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

const FeatureCard = ({ imgName, title, desc, w, h }: FeatureCardProps) => (
  <div className={styles.gridCard}>
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

export const HomePage = () => {
  const {
    isContactOpen,
    setIsContactOpen,
    isFiltersOpen,
    setIsFiltersOpen,
    popularGifts,
    isLoadingGifts,
    wishlistItems,
    dispatch,
  } = useHomePage();

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
              <Button variant="primary" size="default">
                Start Gift Search
              </Button>
            </Link>
            <Button variant="secondary" size="large" onClick={() => setIsFiltersOpen(true)}>
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
          wishlists for birthdays or holidays and share private links with family.
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
          {DESKTOP_ORDER.map((key) => (
            <FeatureCard key={`desktop-${key}`} {...FEATURES_DATA[key]} />
          ))}
        </div>

        <div className={`${styles.masonryGrid} ${styles.mobileOnly}`}>
          {MOBILE_ORDER.map((key) => (
            <FeatureCard key={`mobile-${key}`} {...FEATURES_DATA[key]} />
          ))}
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
            <Button variant="primary" size="default">
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
          <Button variant="secondary" size="large" onClick={() => setIsFiltersOpen(true)}>
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
          {isLoadingGifts ? (
            <p>Loading popular ideas...</p>
          ) : (
            popularGifts.map((product) => {
              const isFavorite = wishlistItems.some((item) => item.id === product.id);

              const handleToggleFavorite = () => {
                if (isFavorite) {
                  dispatch(removeGiftFromWishlist(product.id));
                } else {
                  dispatch(addGiftToWishlist(product));
                }
              };

              return (
                <ProductCard
                  key={product.id}
                  asin={product.asin}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.image_url ?? ''}
                  description={product.description ?? undefined}
                  amazonUrl={product.amazon_url}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })
          )}
        </div>
      </section>
      {isContactOpen && <ContactsWindow onClose={() => setIsContactOpen(false)} />}

      {isFiltersOpen && <ReadyIdeasWindow onClose={() => setIsFiltersOpen(false)} />}
    </div>
  );
};
