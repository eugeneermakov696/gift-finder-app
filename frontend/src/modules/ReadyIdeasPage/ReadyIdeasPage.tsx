import { useParams, useNavigate, Link } from 'react-router-dom';
import { BUDGET_TIERS } from '../../shared/constants/readyIdeas';
import { Button } from '../../shared/components/Button';
import styles from './ReadyIdeasPage.module.scss';

const formatSlug = (slug?: string): string => {
  if (!slug) return '';

  let cleanSlug = slug.replace(/^gifts-for-/, '');
  cleanSlug = cleanSlug.replace(/-s-/g, "'s-");

  return cleanSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const mapSlugToApiRecipient = (slug: string): string => {
  const s = slug.toLowerCase();
  if (s.includes('mom') || s.includes('dad') || s.includes('grandparent') || s.includes('in-law'))
    return 'relatives';
  if (s.includes('friend')) return 'friend';
  if (
    s.includes('boyfriend') ||
    s.includes('husband') ||
    s.includes('girlfriend') ||
    s.includes('wife')
  )
    return 'partner';
  return 'other';
};

const mapSlugToApiOccasion = (slug: string): string => {
  const s = slug.toLowerCase();

  if (s.includes('mother')) return 'mother_day';
  if (s.includes('father')) return 'father_day';
  if (s.includes('birthday')) return 'birthday';
  if (s.includes('christmas')) return 'christmas';
  if (s.includes('anniversary')) return 'anniversary';
  if (s.includes('housewarming')) return 'housewarming';
  if (s.includes('wedding') || s.includes('engagement')) return 'wedding_or_engagement';
  if (s.includes('thanksgiving')) return 'thanksgiving';
  if (s.includes('halloween')) return 'halloween';
  if (s.includes('party')) return 'party';
  if (s.includes('graduation')) return 'graduation';
  if (s.includes('retirement')) return 'retirement';

  return s.replace(/-/g, '_');
};

export const ReadyIdeasPage = () => {
  const { recipient, occasion } = useParams<{ recipient: string; occasion: string }>();
  const navigate = useNavigate();

  const formattedRecipient = formatSlug(recipient);
  const formattedOccasion = formatSlug(occasion);

  const handleSeeIdeas = (minPrice?: number, maxPrice?: number) => {
    const params = new URLSearchParams();

    const apiRecipient = mapSlugToApiRecipient(recipient || '');
    const apiOccasion = mapSlugToApiOccasion(occasion || '');

    if (apiRecipient) params.append('recipient', apiRecipient);
    if (apiOccasion) params.append('occasion', apiOccasion);
    if (minPrice !== undefined) params.append('min_price', minPrice.toString());
    if (maxPrice !== undefined) params.append('max_price', maxPrice.toString());

    params.append('loader', 'true');

    navigate(`/catalog?${params.toString()}`);
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
                variant="primary"
                size="default"
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
