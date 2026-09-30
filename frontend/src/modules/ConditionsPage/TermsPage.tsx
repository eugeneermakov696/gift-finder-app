import { Link } from 'react-router-dom';
import styles from './TermsPage.module.scss';

export const TermsPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Terms of Service</h1>

      <div className={styles.metaInfo}>
        Effective Date: September 20, 2026 | Last Updated: September 20, 2026
      </div>

      <div className={styles.introSection}>
        <p className={styles.introText}>
          Welcome to Giftly (accessible at [https://eugeneermakov696.github.io/gift-finder-app/] /
          "the Website"). These Terms of Service ("Terms") govern your access to and use of Giftly,
          including our gift-discovery quiz, curated guides, product recommendations, and related
          services.
        </p>
        <Link to="/" className={styles.backLink}>
          Back to home <span className={styles.arrowIcon} />
        </Link>
      </div>

      <p className={styles.introText}>
        By accessing or using Giftly, you agree to be bound by these Terms and our Privacy Policy.
        If you do not agree, please discontinue using the Website immediately.
      </p>

      <section className={styles.section}>
        <h2>1. What Giftly Is (Nature of Service)</h2>
        <p>
          Giftly is a free online product discovery platform designed to help users find gift ideas
          tailored to personal interests, occasions, and budgets.
        </p>
        <ul>
          <li>Giftly is not a seller, merchant, or retailer.</li>
          <li>We do not stock, pack, warehouse, sell, or ship physical products.</li>
          <li>
            We do not process payments, collect billing information, or handle customer order
            fulfillments.
          </li>
        </ul>
        <p>
          Any transaction initiated through links on Giftly is conducted exclusively between you and
          the third-party merchant (such as Amazon.com or its affiliated sellers).
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. User Accounts and Security</h2>
        <p>
          To access personalized features, such as creating, organizing, and saving custom gift
          wishlists, you may register for an account. By registering, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information during registration.</li>
          <li>
            Maintain the security, confidentiality, and integrity of your login credentials and
            password.
          </li>
          <li>
            Accept responsibility for all actions and interactions conducted under your account.
          </li>
          <li>
            Notify us immediately at hello@giftly.com if you suspect any unauthorized access or
            security breach.
          </li>
        </ul>
        <p className={styles.introText}>
          Giftly reserves the right to suspend, restrict, or terminate your account at our sole
          discretion, without prior notice, if we identify fraudulent activity, system abuse, or a
          breach of these Terms.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Wishlists and Public Sharing</h2>
        <ul>
          <li>
            <strong>Creating Wishlists:</strong> Registered users may save recommended gift products
            and organize them into personal collections ("Wishlists").
          </li>
          <li>
            <strong>Public & Shareable Links:</strong> Giftly allows you to generate shareable links
            to your wishlists. You acknowledge and agree that anyone with access to that link can
            view the items within that specific list and your public display name. You remain solely
            responsible for managing the sharing settings of your wishlists.
          </li>
          <li>
            <strong>Appropriate Content:</strong> You agree not to include list titles,
            descriptions, notes, or usernames that are defamatory, abusive, offensive, unlawful, or
            infringing upon third-party intellectual property rights. Giftly reserves the right to
            remove non-compliant content or wishlists at any time.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Amazon Associates & Affiliate Disclosure</h2>
        <p>
          To Giftly is a participant in the Amazon Services LLC Associates Program, an affiliate
          advertising program designed to provide a means for sites to earn advertising fees by
          advertising and linking to Amazon.com and affiliated sites. As an Amazon Associate, Giftly
          earns from qualifying purchases. Clicking on product links or buttons (e.g., "View on
          Amazon" or "Check Price on Amazon") redirects you to Amazon.com with our affiliate
          tracking tag attached.
        </p>

        <p className={styles.introText}>
          This referral occurs at no extra cost to you. The price you pay on Amazon remains exactly
          the same whether you use our links or navigate directly.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Product Pricing, Availability, and Specifications</h2>
        <p>
          We make every effort to display accurate and current product titles, categories, and price
          ranges. However:
        </p>
        <ul>
          <li>
            Product prices, discounts, stock availability, ratings, and shipping options on Amazon
            fluctuate frequently in real time.
          </li>
          <li>
            Information displayed on Giftly may occasionally differ from the current listing on
            Amazon.
          </li>
        </ul>
        <p>
          The price and availability displayed on Amazon.com at the time of your purchase will
          govern your transaction. Giftly makes no guarantees regarding price accuracy or item
          availability.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Third-Party Purchases, Shipping, and Returns</h2>
        <p>Because all purchases are completed directly on Amazon:</p>
        <ul>
          <li>
            Any issues regarding delivery delays, lost shipments, damaged goods, defective products,
            or return requests are governed strictly by Amazon’s Conditions of Use and individual
            seller return policies.
          </li>
          <li>
            Giftly has no access to your Amazon order history, personal address, or payment details.
          </li>
          <li>
            Giftly is not responsible for, and cannot assist with, customer service requests,
            refunds, warranty claims, or product returns. All such inquiries must be directed to
            Amazon Customer Support.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>7. Intellectual Property Rights</h2>
        <p>
          <strong>Giftly Content:</strong> The Website design, logos, quiz algorithms, UI structure,
          written copy, and curated collections are the exclusive property of Giftly and are
          protected by applicable intellectual property laws. You may not scrape, reproduce,
          duplicate, or exploit any portion of the Website without our express written consent.
        </p>
        <p>
          <strong>Third-Party Trademarks:</strong> Amazon, Amazon Prime, and the Amazon logo are
          registered trademarks of Amazon.com, Inc. or its affiliates. All brand names, product
          titles, and logos referenced on Giftly belong to their respective trademark owners and are
          used solely for identification and descriptive purposes.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. User Conduct and Acceptable Use</h2>
        <p>
          When using Giftly (including our interactive quiz and recommendation tools), you agree not
          to:
        </p>
        <ul>
          <li>
            Use automated bots, scrapers, or crawlers to extract product data or content from the
            site.
          </li>
          <li>
            Attempt to bypass security features, reverse-engineer the quiz engine, or disrupt server
            infrastructure.
          </li>
          <li>Misrepresent your identity or use the site for any unlawful purpose.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>9. Disclaimer of Warranties</h2>
        <p>
          Giftly is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind,
          whether express, implied, or statutory. To the maximum extent permitted by applicable law,
          Giftly disclaims all warranties, including but not limited to:
        </p>
        <ul>
          <li>
            Implied warranties of merchantability, fitness for a particular gift recipient or
            purpose, and non-infringement.
          </li>
          <li>
            That recommendations will guarantee personal satisfaction or approval from the gift
            recipient.
          </li>
          <li>That the Website will operate uninterrupted, secure, or error-free at all times.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, Giftly, its founders, affiliates, and
          partners shall not be liable for any indirect, incidental, consequential, special, or
          punitive damages arising out of or related to:
        </p>
        <ul>
          <li>Your use of or inability to use Giftly.</li>
          <li>
            Any transactions, interactions, or disputes between you and Amazon or third-party
            sellers.
          </li>
          <li>
            The quality, safety, usability, or performance of any product purchased through an
            affiliate link.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>11. Changes to These Terms</h2>
        <p>
          We reserve the right to revise and update these Terms at our sole discretion. Any
          modifications take effect immediately upon posting to this page. Your continued use of
          Giftly following the posting of revised Terms signifies your acceptance of the changes.
        </p>
      </section>

      <section className={styles.section}>
        <h2>12. Contact Information</h2>
        <p>
          If you have questions, feedback, or legal inquiries regarding these Terms of Service,
          please contact us:
        </p>
        <ul>
          <li>
            <strong>Brand:</strong> Giftly
          </li>
          <li>
            <strong>Email:</strong> hello@giftly.com
          </li>
          <li>
            <strong>Website:</strong>{' '}
            <a href="https://eugeneermakov696.github.io/gift-finder-app/">
              github.io/gift-finder-app
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};
