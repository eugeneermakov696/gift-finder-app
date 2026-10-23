import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/Button';
import { useFiltersForm } from '../../shared/hooks/useFiltersPage';
import styles from './FiltersPage.module.scss';
import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from '../../shared/constants/options';

export const FiltersPage = () => {
  const {
    age,
    setAge,
    gender,
    setGender,
    relationship,
    setRelationship,
    interests,
    setInterests,
    budget,
    setBudget,
    toggleSelection,
    handleGenerate,
  } = useFiltersForm();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Gift search</h1>
        <Link to="/" className={styles.backLink}>
          Back to home
          <span className={styles.arrowIcon} aria-label="Right arrow" />
        </Link>
      </header>

      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>How old are they?</h3>
        <div className={styles.grid}>
          {AGE_OPTIONS.map((option) => (
            <label key={option} className={styles.customLabel}>
              <input
                type="radio"
                name="age"
                value={option}
                checked={age === option}
                onChange={(e) => setAge(e.target.value)}
                className={styles.hiddenInput}
              />
              <span className={styles.customButton}>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>Gender</h3>
        <div className={styles.grid}>
          {GENDER_OPTIONS.map((option) => (
            <label key={option} className={styles.customLabel}>
              <input
                type="radio"
                name="gender"
                value={option}
                checked={gender === option}
                onChange={(e) => setGender(e.target.value)}
                className={styles.hiddenInput}
              />
              <span className={styles.customButton}>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>Who is this person to you?</h3>
        <div className={styles.grid}>
          {RELATIONSHIP_OPTIONS.map((option) => (
            <label key={option} className={styles.customLabel}>
              <input
                type="radio"
                name="relationship"
                value={option}
                checked={relationship === option}
                onChange={(e) => setRelationship(e.target.value)}
                className={styles.hiddenInput}
              />
              <span className={styles.customButton}>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>What are their main interests?</h3>
        <div className={styles.grid}>
          {INTEREST_OPTIONS.map((option) => (
            <label key={option} className={styles.customLabel}>
              <input
                type="checkbox"
                checked={interests.includes(option)}
                onChange={() => toggleSelection(option, interests, setInterests)}
                className={styles.hiddenInput}
              />
              <span className={styles.customButton}>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.filterSection}>
        <div className={styles.sliderWrapper}>
          <h3 className={styles.sectionTitle}>What’s your budget limit?</h3>
          <div className={styles.budgetHeader}>
            <span>Gift budget</span>
            <span className={styles.budgetValue}>${budget}</span>
          </div>

          <div className={styles.sliderWrapper}>
            <Slider
              min={5}
              max={1000}
              step={5}
              value={budget}
              onChange={(val) => setBudget(val as number)}
              styles={{
                track: {
                  backgroundColor: 'var(--color-info-800)',
                  height: 16,
                  borderRadius: 8,
                  cursor: 'pointer',
                },
                rail: {
                  backgroundColor: '#fff',
                  height: 16,
                  borderRadius: 8,
                  cursor: 'pointer',
                },
                handle: {
                  display: 'none',
                },
              }}
            />
          </div>

          <div className={styles.budgetLimits}>
            <span>$5</span>
            <span>$200+</span>
          </div>
        </div>
      </section>

      <div className={styles.actionFooter}>
        <Button variant="primary" size="default" onClick={handleGenerate}>
          Generate
        </Button>
      </div>
    </div>
  );
};
