import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/Button';
import styles from './RegisterModal.module.scss';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginClick = () => {
    onClose();
    onSwitchToLogin();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include a letter and a number.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userProfile = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    localStorage.setItem('giftly_user', JSON.stringify(userProfile));
    localStorage.setItem('giftly_isAuth', 'true');

    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false,
    });
    onClose();

    // TODO: add Redux dispatch
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
            Sign in or create an account to save favourites, build gift lists, and get personalized
            recommendations.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <span className={`${styles.iconLeft} ${styles.userIcon}`} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                className={styles.withIconLeft}
                required
              />
            </div>
            {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <span className={`${styles.iconLeft} ${styles.emailIcon}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={styles.withIconLeft}
                required
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
            {errors.confirmPassword && (
              <span className={styles.errorMsg}>{errors.confirmPassword}</span>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className={styles.customCheckbox}
                required
              />
              <span>
                I agree to the <Link to="/terms&conditions">Terms & Conditions</Link> and{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <Button variant="secondary" size="extraLarge" type="submit" className={styles.submitBtn}>
            Create Account
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?
          <button type="button" className={styles.loginLink} onClick={handleLoginClick}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
