import React, { useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import styles from './EditModal.module.scss';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditModal = ({ isOpen, onClose}: EditModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.username || '',
    password: '',
    confirmPassword: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    if (formData.password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters, include a letter and a number.';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    onClose();

    console.log('data is ready to be sent to backend', formData);
    // dispatch(updateProfile(...)); dispatch(changePassword(...))
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.header}>
          <h2>Edit Profile</h2>
          <p>
            Update your personal information and account details.
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
                placeholder="Old password"
                className={styles.withIconRight}
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
                placeholder="New password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
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

          <Button variant="secondary" size="extraLarge" type="submit" className={styles.submitBtn}>
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
};
