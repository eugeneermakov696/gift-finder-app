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
    errors,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    isLoading,
    authError,
    handleSubmit,
    fullNameRef,
    emailRef,
    oldPasswordRef,
    newPasswordRef,
    user,
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

        {/* Додано noValidate */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className={`${styles.inputWrapper} ${errors.fullName ? styles.hasError : ''}`}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Name</label>
              <span className={`${styles.iconLeft} ${styles.userIcon}`} />
              <input
                type="text"
                name="fullName"
                ref={fullNameRef}
                defaultValue={user ? `${user.first_name} ${user.last_name}`.trim() : ''}
                placeholder="Enter your name"
                className={styles.withIconLeft}
                required
                disabled={isLoading}
              />
            </div>
            {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ''}`}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Email</label>
              <span className={`${styles.iconLeft} ${styles.emailIcon}`} />
              <input
                type="email"
                name="email"
                ref={emailRef}
                defaultValue={user?.email || user?.username || ''}
                placeholder="Enter your Email"
                className={styles.withIconLeft}
                required
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          {/* Old Password */}
          <div className={`${styles.inputWrapper} ${errors.oldPassword ? styles.hasError : ''}`}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Old Password</label>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showOldPassword ? 'text' : 'password'}
                name="oldPassword"
                ref={oldPasswordRef}
                placeholder="Old password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className={`${styles.iconRight} ${styles.eyeIcon} ${showOldPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                onClick={() => setShowOldPassword(!showOldPassword)}
                aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                disabled={isLoading}
              />
            </div>
            {errors.oldPassword && <span className={styles.errorMsg}>{errors.oldPassword}</span>}
          </div>

          {/* New Password */}
          <div className={`${styles.inputWrapper} ${errors.newPassword ? styles.hasError : ''}`}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>New Password</label>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                ref={newPasswordRef}
                placeholder="New password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className={`${styles.iconRight} ${styles.eyeIcon} ${showNewPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                disabled={isLoading}
              />
            </div>
            {errors.newPassword && <span className={styles.errorMsg}>{errors.newPassword}</span>}
          </div>

          {/* Глобальна помилка вирівняна відносно потоку, щоб не накладалася на кнопку */}
          {authError && <div className={styles.errorMsg} style={{ position: 'relative', marginTop: '0' }}>{authError}</div>}

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