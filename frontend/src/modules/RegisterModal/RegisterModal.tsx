import { useState } from 'react';
import styles from './RegisterModal.module.scss';
import { Link } from 'react-router-dom';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.header}>
          <h2>Create Account</h2>
          <p>
            Sign in or create an account to save favourites, build gift lists, 
            and get personalized recommendations.
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={`${styles.iconLeft} ${styles.userIcon}`} />
            <input 
              type="text" 
              placeholder="Full name" 
              className={styles.withIconLeft} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={`${styles.iconLeft} ${styles.emailIcon}`} />
            <input 
              type="email" 
              placeholder="Email address" 
              className={styles.withIconLeft} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <input type="text" placeholder="Location" required />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className={styles.withIconRight} 
              required 
            />
            <button 
              type="button" 
              className={`${styles.iconRight} ${styles.eyeIcon}`} 
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password" 
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirmed Password" 
              className={`${styles.withIconLeft} ${styles.withIconRight}`} 
              required 
            />
            <button 
              type="button" 
              className={`${styles.iconRight} ${styles.eyeIcon}`} 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password" 
            />
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.customCheckbox} required />
            <span>
              I agree to the <Link to="/terms&conditions">Terms & Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
            </span>
          </label>

          <button type="submit" className={styles.submitBtn}>
            Create Account
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <button type="button" className={styles.loginLink}>Log In</button>
        </div>
      </div>
    </div>
  );
}