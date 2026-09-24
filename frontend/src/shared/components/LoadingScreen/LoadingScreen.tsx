import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.scss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbGenerating } from './OrbGenerating';

const STATUS_MESSAGES = [
  'Finding the Perfect Matches...',
  'Filtering 4★+ Amazon ratings...',
  'Matching with their hobbies and budget...',
  'Handpicking the best gift ideas...',
];

interface LoadingScreenProps {
  onCancel: () => void;
  onComplete: () => void;
}

export const LoadingScreen = ({ onCancel, onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const textInterval = setInterval(() => {
      setActiveTextIndex((prev) => {
        if (prev < STATUS_MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.circleWrapper}>
        <OrbGenerating />
      </div>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.statusSection}>
        <h4 className={styles.statusTitle}>Dynamic Status:</h4>
        <ul className={styles.statusList}>
          {STATUS_MESSAGES.map((msg, index) => (
            <li
              key={index}
              className={`${styles.statusItem} ${index === activeTextIndex ? styles.active : ''}`}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>

      <button className={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};
