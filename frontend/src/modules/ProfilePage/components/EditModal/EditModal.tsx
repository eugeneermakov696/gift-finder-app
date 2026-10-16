import React from 'react';
import { Button } from '../../../../shared/components/Button';
import { useEditProfileForm } from '../../../../shared/hooks/useEditProfileForm';
import styles from './EditModal.module.scss';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditModal = ({ isOpen, onClose }: EditModalProps) => {
  const {
    formData,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  } = useEditProfileForm(onClose);

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

          <Button variant="secondary" size="large" type="submit" className={styles.submitBtn}>
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
};
