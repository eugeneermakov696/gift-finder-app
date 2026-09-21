import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './FiltersPage.module.scss';

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
        <p className={styles.backLink}>
          Back <span>→</span>
        </p>
        <h1 className={styles.pageTitle}>Find a gift</h1>
      </header>

      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>
          What is the age of the person you are buying a gift for?
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
          What is the gender of the person you are buying a gift for?
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
        <h3 className={styles.sectionTitle}>What is your relationship to this person?</h3>
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
        <h3 className={styles.sectionTitle}>What are their interests?</h3>
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
        <h3 className={styles.sectionTitle}>What kind of gift do you want to give?</h3>
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
        <h3 className={styles.sectionTitle}>Choose your budget</h3>
        <div className={styles.budgetHeader}>
          <span>Gift budget</span>
          <span className={styles.budgetValue}>${budget}</span>
        </div>

        <div className={styles.sliderWrapper}>
          <Slider 
            min={0}
            max={1000}
            step={10}
            value={budget}
            onChange={(val) => setBudget(val as number)}
            styles={{
              track: {
                backgroundColor: '#3b82f6',
                height: 16,
                borderRadius: 8,
                cursor: 'pointer'
              },
              rail: {
                backgroundColor: '#e5e5e5',
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
          <span>$0</span>
          <span>$1000+</span>
        </div>
      </div>
      </section>

      <div className={styles.actionFooter}>
        <button className={styles.generateBtn}>Generate</button>
      </div>
    </div>
  );
};
