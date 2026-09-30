import { Link } from 'react-router-dom';
import styles from './RightsPage.module.scss';

export const RightsPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Privacy Policy</h1>

      <div className={styles.metaInfo}>
        Effective Date: September 20, 2026 | Last Updated: September 20, 2026
      </div>

      <div className={styles.introSection}>
        <p className={styles.introText}>
          At Giftly (accessible at{' '}
          <a href="https://eugeneermakov696.github.io/gift-finder-app/">
            github.io/gift-finder-app
          </a>
          , "we," "us," or "our"), we respect your privacy and are committed to protecting your
          personal data. This Privacy Policy explains how we collect, use, store, and safeguard your
          information when you visit our website, register for an account, create and manage gift
          wishlists, and interact with our affiliate links.
        </p>

        <Link to="/" className={styles.backLink}>
          Back to home <span className={styles.arrowIcon} />
        </Link>
      </div>

      <p className={styles.introText}>
        Please read this policy carefully before using Giftly. If you do not agree with any part of
        this Privacy Policy, please discontinue using the service.
      </p>

      <section className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information directly from you when you register, as well as automatically when
          you use our platform.
        </p>

        <p>
          <strong>a. Account & Profile Information (Directly Provided)</strong>
        </p>
        <p>When you register on Giftly to create and save wishlists, we collect:</p>
        <ul>
          <li>
            <strong>Account Credentials:</strong> Your email address, chosen password (stored in
            securely hashed form), and display name/username.
          </li>
          <li>
            <strong>Third-Party Sign-In (Optional):</strong> If you sign up using a third-party
            service (such as Google or Apple), we receive basic authentication details (name, email
            address, and profile ID) authorized by you via that provider.
          </li>
          <li>
            <strong>Wishlist Data:</strong> The titles, curated gift items, personal notes, occasion
            dates (e.g., your birthday), and priority tags you add to your wishlists.
          </li>
          <li>
            <strong>Wishlist Privacy Settings:</strong> Whether you designate a wishlist as Private
            (visible only to you) or Shared/Public (accessible via a unique link you share with
            friends and family).
          </li>
        </ul>

        <p>
          <strong>b. Quiz & Usage Inputs</strong>
        </p>
        <p>
          <strong>Gift Discovery Parameters:</strong> Non-personal inputs submitted during quiz
          sessions (recipient vibe, age brackets, budget limits, relationship context) to generate
          recommendations. If you are logged in, you may choose to save these recommendations
          directly into your custom wishlists.
        </p>

        <p>
          <strong>c. Automatically Collected Technical Data</strong>
        </p>
        <p>
          Like most online services, our servers automatically collect log data when you access
          Giftly:
        </p>
        <ul>
          <li>
            IP address, approximate geographical location (country/city), browser type, and
            operating system.
          </li>
          <li>
            Referring URLs, device identifiers, pages visited, features used, and timestamps of site
            visits.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. Cookies, Tracking & Amazon Associates Program</h2>

        <p>
          <strong>a. Amazon Associates Affiliate Cookies</strong>
        </p>
        <p>
          Giftly is a participant in the Amazon Services LLC Associates Program. When you click on
          product links or buttons (such as "View on Amazon" or "Check Price on Amazon"), an
          affiliate tracking cookie is placed in your browser by Amazon:
        </p>
        <ul>
          <li>
            <strong>Tracking Purpose:</strong> This informs Amazon that you were referred by Giftly,
            allowing us to earn an advertising commission if you make a qualifying purchase.
          </li>
          <li>
            <strong>No Access to Financial Data:</strong> Giftly never accesses, handles, or stores
            your Amazon payment methods, credit card details, residential shipping addresses, or
            Amazon account credentials. All transactions take place securely on{' '}
            <a href="https://Amazon.com">Amazon.com</a> under Amazon's Privacy Notice.
          </li>
        </ul>

        <p>
          <strong>b. Essential & Session Cookies</strong>
        </p>
        <p>
          We use essential first-party cookies to keep you logged into your Giftly account,
          authenticate your sessions, and ensure the security of your saved wishlists.
        </p>

        <p>
          <strong>c. Analytics</strong>
        </p>
        <p>
          We may utilize privacy-compliant analytics tools (such as Google Analytics) to monitor
          aggregate platform usage, identify technical errors, and improve our recommendation
          algorithm.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. How We Use Your Information</h2>
        <p>We process your data for the following legitimate purposes:</p>
        <ul>
          <li>
            <strong>Account Management:</strong> To register, authenticate, and maintain your user
            profile and security.
          </li>
          <li>
            <strong>Wishlist Functionality:</strong> To save, update, organize, and display your
            personalized gift wishlists across multiple devices.
          </li>
          <li>
            <strong>Public Link Sharing:</strong> To generate secure, unique shareable URLs so you
            can send your wishlist to friends, family, or party guests upon your request.
          </li>
          <li>
            <strong>Product Recommendations:</strong> To refine our gift matching algorithms based
            on trending items and popular wishlist preferences (aggregated and anonymized).
          </li>
          <li>
            <strong>Communication:</strong> To send essential account notifications (such as
            password reset links, security alerts, and service updates). We do not send unsolicited
            marketing spam.
          </li>
          <li>
            <strong>Platform Security:</strong> To prevent fraudulent account creation, spam,
            scraping bots, and unauthorized server access.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Wishlist Visibility and Public Sharing</h2>
        <ul>
          <li>
            <strong>Private Wishlists:</strong> By default, your wishlists are private and visible
            only while logged into your registered account.
          </li>
          <li>
            <strong>Shareable Wishlists:</strong> If you choose to enable public sharing or generate
            a shareable link for a wishlist, anyone possessing that link will be able to view the
            contents of that specific wishlist and your chosen display name. You can disable public
            sharing or revert a list to private at any time from your account settings.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. How We Protect and Retain Your Data</h2>
        <ul>
          <li>
            <strong>Encryption:</strong> We enforce industry-standard HTTPS / SSL encryption across
            all data transmitted between your device and our servers.
          </li>
          <li>
            <strong>Password Security:</strong> Passwords are cryptographically hashed using salted,
            one-way encryption algorithms. We never store plain-text passwords.
          </li>
          <li>
            <strong>Data Retention:</strong> We retain your account and wishlist information for as
            long as your account remains active. If you delete your account, your personal
            information and wishlists are permanently removed from our active databases.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>6. Sharing and Disclosure of Information</h2>
        <p>
          We never sell, rent, or trade your personal information to third-party brokers or
          advertisers. We only share information under strict operational circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Infrastructure:</strong> With trusted cloud hosting providers, database
            managers, and authentication services under binding confidentiality and data protection
            agreements.
          </li>
          <li>
            <strong>Legal Requirements:</strong> If required to do so by applicable law, subpoena,
            warrant, or regulatory body.
          </li>
          <li>
            <strong>Safety & Defense:</strong> To protect the legal rights, safety, property, and
            security of Giftly, our community, and the public.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>7. Your Privacy Rights (GDPR & CCPA/CPRA)</h2>
        <p>
          Depending on your jurisdiction, you have enforceable legal rights regarding your personal
          information:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> You can request a summary of the personal data we hold
            about you.
          </li>
          <li>
            <strong>Right to Rectification:</strong> You can update or edit your name, email, and
            wishlist items directly within your profile settings at any time.
          </li>
          <li>
            <strong>Right to Erasure ("Right to be Forgotten"):</strong> You can request the full
            deletion of your Giftly account and all associated wishlists via your profile settings
            or by contacting <a href="mailto:hello@giftly.com">hello@giftly.com</a>.
          </li>
          <li>
            <strong>Right to Opt-Out:</strong> You may manage or block cookies through your browser
            settings.
          </li>
          <li>
            <strong>Non-Discrimination:</strong> We will not discriminate against you for exercising
            any of your privacy rights.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>8. Children's Privacy (COPPA Compliance)</h2>
        <p>
          Giftly account registration is strictly intended for individuals aged 13 and older (and
          18+ for making online purchases on third-party merchant sites). We do not knowingly
          collect personal data from children under 13. If we become aware that a child under 13 has
          created an account without parental consent, we will promptly delete that account and all
          associated data.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to accommodate new platform features
          (such as enhanced wishlist tools) or regulatory changes. Significant updates will be
          notified through your registered email or via a prominent banner on the platform. The
          "Last Updated" date at the top reflects the latest revision.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Contact Information</h2>
        <p>
          If you have questions, feedback, or legal inquiries regarding these Terms of Service,
          please contact us:
        </p>
        <ul>
          <li>
            <strong>Brand:</strong> Giftly
          </li>
          <li>
            <strong>Email:</strong> <a href="mailto:hello@giftly.com">hello@giftly.com</a>
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
