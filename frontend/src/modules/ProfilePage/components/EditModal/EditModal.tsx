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
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    isLoading,
    authError,
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
          <p>Update your personal information and account details.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Name</label>
              <span className={`${styles.iconLeft} ${styles.userIcon}`} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className={styles.withIconLeft}
                required
              />
            </div>
            {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Email</label>
              <span className={`${styles.iconLeft} ${styles.emailIcon}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className={styles.withIconLeft}
                required
              />
            </div>
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          {/* Old Password */}
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Password</label>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showOldPassword ? 'text' : 'password'}
                name="old password"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Old password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
              />
              <button
                type="button"
                className={`${styles.iconRight} ${styles.eyeIcon}`}
                onClick={() => setShowOldPassword(!showOldPassword)}
                aria-label="Toggle old password"
              />
            </div>
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          {/* New Password */}
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Password</label>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
              />
              <button
                type="button"
                className={`${styles.iconRight} ${styles.eyeIcon}`}
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label="Toggle new password"
              />
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMsg}>{errors.confirmPassword}</span>
            )}
          </div>

          {authError && <div className={styles.errorMsg}>{authError}</div>}

          <Button
            variant="secondary"
            size="large"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};
