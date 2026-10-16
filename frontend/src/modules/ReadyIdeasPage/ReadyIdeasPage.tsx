import { useParams, useNavigate, Link } from 'react-router-dom';
import { BUDGET_TIERS } from '../../shared/constants/readyIdeas';
import { Button } from '../../shared/components/Button';
import styles from './ReadyIdeasPage.module.scss';

const formatSlug = (slug?: string): string => {
  if (!slug) return '';
  
  const cleanSlug = slug.replace(/^gifts-for-/, '');
  
  return cleanSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const ReadyIdeasPage = () => {
  const { recipient, occasion } = useParams<{ recipient: string; occasion: string }>();
  const navigate = useNavigate();

  const formattedRecipient = formatSlug(recipient);
  const formattedOccasion = formatSlug(occasion);

  const handleSeeIdeas = (minPrice?: number, maxPrice?: number) => {
    const params = new URLSearchParams();

    if (formattedRecipient) params.append('recipient', formattedRecipient);
    if (formattedOccasion) params.append('occasion', formattedOccasion);
    if (minPrice !== undefined) params.append('min_price', minPrice.toString());
    if (maxPrice !== undefined) params.append('max_price', maxPrice.toString());

    navigate(`/catalog?${params.toString()}`, {
      state: { fromGenerate: true },
    });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <span>Ready Ideas</span>
        <span className={styles.separator}>•</span>
        <span>{formattedRecipient}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            {formattedOccasion} {formattedRecipient}
          </h1>
          <p className={styles.subtitle}>
            Choose a budget and explore handpicked gift ideas they’ll love.
          </p>
        </div>

        <Link to="/" className={styles.backLink}>
          Back to home <span className={styles.arrowIcon} />
        </Link>
      </header>

      <div className={styles.cardsGrid}>
        {BUDGET_TIERS.map((tier) => (
          <div key={tier.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={`${import.meta.env.BASE_URL}images/${tier.imgName}`}
                alt={`${formattedRecipient} ${formattedOccasion} ${tier.badge}`}
                className={styles.cardImage}
              />
              <span className={styles.priceBadge}>{tier.badge}</span>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>
                {formattedRecipient} {formattedOccasion}
              </h3>
              <p className={styles.cardSubtitle}>{tier.subtitle}</p>

              <Button
                variant='primary'
                size='default'
                className={styles.seeIdeasBtn}
                onClick={() => handleSeeIdeas(tier.minPrice, tier.maxPrice)}
              >
                See ideas
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};