import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.scss';
import { OrbGenerating } from './OrbGenerating';

const STATUS_MESSAGES = [
  'Finding the Perfect Matches...',
  'Filtering 4★+ Amazon ratings...',
  'Matching with their hobbies and budget...',
  'Handpicking the best gift ideas...',
];

interface LoadingScreenProps {
  isLoading?: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export const LoadingScreen = ({ isLoading = false, onCancel, onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setActiveTextIndex((prev) => {
        if (prev < STATUS_MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90 && isLoading) {
          return 90;
        }
        
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        
        return prev + 2; 
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  useEffect(() => {
    if (progress >= 100 && !isLoading) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [progress, isLoading, onComplete]);

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
        <p className={`${styles.statusItem} ${styles.active}`}>
          {STATUS_MESSAGES[activeTextIndex]}
        </p>
      </div>

      <button className={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};