import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/Button';
import { useRegisterForm } from '../../shared/hooks/useRegistrationForm';
import styles from './RegisterModal.module.scss';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const {
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    authError,
    handleSubmit,
    fullNameRef,
    emailRef,
    passwordRef,
    confirmPasswordRef,
    agreedToTermsRef,
  } = useRegisterForm({ onClose });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/profile', { state: { autoFocusEmail: true } });
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
                placeholder="Enter your Email"
                className={styles.withIconLeft}
                required
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ''}`}>
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Password</label>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                ref={passwordRef}
                placeholder="Write your password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className={`${styles.iconRight} ${showPassword ? styles.eyeIcon : styles.eyeClosedIcon}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              />
            </div>
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div
            className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.hasError : ''}`}
          >
            <div className={styles.inputGroup}>
              <label className={styles.floatingLabel}>Password</label>
              <span className={`${styles.iconLeft} ${styles.lockIcon}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                ref={confirmPasswordRef}
                placeholder="Confirmed Password"
                className={`${styles.withIconLeft} ${styles.withIconRight}`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className={`${styles.iconRight} ${showConfirmPassword ? styles.eyeIcon : styles.eyeClosedIcon}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMsg}>{errors.confirmPassword}</span>
            )}
          </div>

          {/* Checkbox */}
          <div className={`${styles.inputWrapper} ${errors.agreedToTerms ? styles.hasError : ''}`}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreedToTerms"
                ref={agreedToTermsRef}
                className={styles.customCheckbox}
                required
                disabled={isLoading}
              />
              <span>
                I agree to the <Link to="/terms&conditions">Terms & Conditions</Link> and{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreedToTerms && (
              <span className={styles.errorMsg}>{errors.agreedToTerms}</span>
            )}
          </div>

          {authError && (
            <p className={styles.errorMsg} style={{ position: 'relative' }}>
              {authError}
            </p>
          )}

          <Button
            variant="secondary"
            size="large"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
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
