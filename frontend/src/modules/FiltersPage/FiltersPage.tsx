import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './FiltersPage.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../shared/components/LoadingScreen';

const AGE_OPTIONS = [
  '0-2 years',
  '3-5 years',
  '6-12 years',
  '13-17 years',
  '18-24 years',
  '25-34 years',
  '35-44 years',
  '45-54 years',
  '55-64 years',
  '65+ years',
];
const GENDER_OPTIONS = ['Male', 'Female'];
const RELATIONSHIP_OPTIONS = [
  'Parent',
  'Friend',
  'Child',
  'Grandparent',
  'Boss',
  'Relative',
  'Partner',
  'Sibling',
  'Grandchild',
  'Colleague',
  'Neighbor',
  'Other',
];
const INTEREST_OPTIONS = [
  'Sports',
  'Gaming',
  'Art',
  'Beauty',
  'Travel',
  'Movies',
  'Fitness',
  'Music',
  'Fashion',
  'Cooking',
  'Books',
  'Photography',
  'Pets',
  'Jewelry',
  'Wine',
  'Coffee',
  'Wellness',
  'Outdoor',
  'Tech',
  'Crafts',
  'Experiences',
  'Home & Decor',
  'Other',
];
const GIFT_TYPE_OPTIONS = [
  'Practical / Useful',
  'Romantic',
  'Entertaining / Fun',
  'Luxurious',
  'Creative',
  'Educational',
  'Adventurous',
  'Other',
];

export const FiltersPage = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [relationship, setRelationship] = useState('');

  const [interests, setInterests] = useState<string[]>([]);
  const [giftTypes, setGiftTypes] = useState<string[]>([]);

  const [budget, setBudget] = useState(450);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    setIsLoading(true);
  };

  const toggleSelection = (
    value: string,
    currentList: string[],
    setList: (val: string[]) => void,
  ) => {
    if (currentList.includes(value)) {
      setList(currentList.filter((item) => item !== value));
    } else {
      setList([...currentList, value]);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Gift search</h1>
        <Link to="/" className={styles.backLink}>
          Back <span className={styles.arrowIcon} aria-label="Right arrow" />
        </Link>
      </header>

      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>
          How old are they?
        </h3>
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
        <h3 className={styles.sectionTitle}>
          Gender
        </h3>
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
        <h3 className={styles.sectionTitle}>What’s the vibe of the gift?</h3>
        <div className={styles.grid}>
          {GIFT_TYPE_OPTIONS.map((option) => (
            <label key={option} className={styles.customLabel}>
              <input
                type="checkbox"
                checked={giftTypes.includes(option)}
                onChange={() => toggleSelection(option, giftTypes, setGiftTypes)}
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
                  cursor: 'pointer'
                },
                rail: {
                  backgroundColor: '#fff',
                  height: 16,
                  borderRadius: 8,
                  cursor: 'pointer'
                },
                handle: {
                  display: 'none'
                }
              }}
            />
          </div>

          <div className={styles.budgetLimits}>
            <span>$5</span>
            <span>$1000+</span>
          </div>
        </div>
      </section>

      <div className={styles.actionFooter}>
        <button className={styles.generateBtn} onClick={handleGenerate}>Generate</button>

        {isLoading && (
         <LoadingScreen
           onCancel={() => setIsLoading(false)}
           onComplete={() => navigate('/catalog')}
           />
       )}
      </div>
    </div>
  );
};
