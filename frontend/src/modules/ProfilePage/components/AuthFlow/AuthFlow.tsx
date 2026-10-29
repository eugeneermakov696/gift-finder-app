import { useLocation, useSearchParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  changePasswordReset,
  fetchMe,
  loginUser,
  requestPasswordReset,
} from '../../../../store/auth/authSlice';
import { mergeGuestWishlist } from '../../../../store/wishlist/wishlistSlice';
import { Button } from '../../../../shared/components/Button';
import type { RootState } from '../../../../store/store';
import styles from './AuthFlow.module.scss';
import { VerificationModal } from '../VerifyEmailModal';

type AuthView =
  | 'login'
  | 'forgot_request'
  | 'forgot_sent'
  | 'code_verified'
  | 'reset_password'
  | 'reset_success'
  | 'reset_expired';

export const AuthFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [authView, setAuthView] = useState<AuthView>(() => {
    return searchParams.get('reset_token') ? 'reset_password' : 'login';
  });

  // Login and Reset Request
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const resetEmailRef = useRef<HTMLInputElement>(null);

  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Creating new password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittedResetEmail, setSubmittedResetEmail] = useState('');

  const { isLoading } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  // Visual password rules
  const isLength = newPassword.length >= 8;
  const isUpper = /[A-Z]/.test(newPassword);
  const isLower = /[a-z]/.test(newPassword);
  const isNumber = /[0-9]/.test(newPassword);
  const isSpecial = /[!@#$%^&*_\-+=?]/.test(newPassword);

  const isPasswordValid =
    isLength &&
    isUpper &&
    isLower &&
    isNumber &&
    isSpecial &&
    newPassword === confirmNewPassword &&
    newPassword !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const email = loginEmailRef.current?.value || '';
    const password = loginPasswordRef.current?.value || '';

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(fetchMe()).unwrap();
      await dispatch(mergeGuestWishlist()).unwrap();
    } catch (error) {
      setLoginError(error as string);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const resetEmail = resetEmailRef.current?.value || '';

    try {
      await dispatch(requestPasswordReset(resetEmail)).unwrap();
      
      setSubmittedResetEmail(resetEmail); 
      setAuthView('forgot_sent');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      await dispatch(
        changePasswordReset({
          newPassword,
          confirmNewPassword,
        }),
      ).unwrap();
      setAuthView('reset_success');
      searchParams.delete('reset_token');
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
      setAuthView('reset_expired');
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (authView === 'login' && location.state?.autoFocusEmail) {
      setTimeout(() => {
        loginEmailRef.current?.focus();
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [authView, location.state]);

  const renderView = () => {
    switch (authView) {
      case 'login':
        return (
          <>
            <div className={styles.loginHeader}>
              <h2>Already have an account?</h2>
              <p>Welcome back! Log in to access your favorites, gift lists, and more.</p>
            </div>
            <form className={styles.loginForm} onSubmit={handleLogin} noValidate>
              <div className={`${styles.inputWrapper} ${loginError ? styles.hasError : ''}`}>
                <label className={styles.floatingLabel}>Email</label>
                <span className={styles.emailIcon} />
                <input
                  type="email"
                  ref={loginEmailRef}
                  placeholder="Enter your Email"
                  className={`${styles.inputField} ${styles.withIconLeft}`}
                  onChange={() => setLoginError('')}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={`${styles.inputWrapper} ${loginError ? styles.hasError : ''}`}>
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  ref={loginPasswordRef}
                  placeholder="Write your password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  onChange={() => setLoginError('')}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${showPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                />
              </div>

              {loginError && (
                <div
                  className={styles.errorMsg}
                  style={{ position: 'relative', marginTop: '-8px', marginBottom: '0' }}
                >
                  {loginError}
                </div>
              )}

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.customCheckbox} disabled={isLoading} />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => setAuthView('forgot_request')}
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.loginBtn}
                disabled={isLoading}
              >
                Log In
              </Button>
            </form>
          </>
        );

      case 'forgot_request':
        return (
          <div className={styles.resetFlowContainer}>
            <div className={styles.loginHeader}>
              <h2>Forgot password?</h2>
              <p>
                Enter the email address associated with your account, and we'll send you a link to
                reset your password.
              </p>
            </div>
            <form className={styles.loginForm} onSubmit={handleRequestReset} noValidate>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Email</label>
                <span className={styles.emailIcon} />
                <input
                  type="email"
                  ref={resetEmailRef}
                  placeholder="Enter your Email"
                  className={`${styles.inputField} ${styles.withIconLeft}`}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </button>
            </form>
          </div>
        );

      case 'forgot_sent':
        return (
          <div className={styles.resetFlowContainer}>
            <div className={styles.iconGraphicWrapper}>
              <div className={styles.planeGraphic} />
            </div>
            <div className={styles.loginHeader}>
              <h2>Check your email</h2>
              <p>We’ve sent a password reset link to your email.</p>
            </div>
            <div className={styles.loginForm}>
              <Button variant="select" size="large" onClick={() => setIsVerifyModalOpen(true)}>
                Enter verification code
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </button>
            </div>
          </div>
        );

      case 'code_verified':
        return (
          <div className={styles.resetFlowContainer}>
            <div className={styles.iconGraphicWrapper}>
              <div className={styles.successGraphic} />
            </div>
            <div className={styles.loginHeader}>
              <h2>Code Verified!</h2>
              <p>Your verification code was correct.</p>
            </div>
            <div className={styles.loginForm}>
              <Button variant="select" size="large" onClick={() => setAuthView('reset_password')}>
                Create new password
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </button>
            </div>
          </div>
        );

      case 'reset_password':
        return (
          <div className={styles.resetFlowContainer}>
            <div className={styles.loginHeader}>
              <h2>Create a new password</h2>
            </div>
            <form className={styles.loginForm} onSubmit={handleResetPassword} noValidate>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Create a new password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${showNewPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.passwordRules}>
                <div className={styles.ruleItem}>
                  <span className={`${styles.ruleCheckbox} ${isLength ? styles.valid : ''}`} />
                  <span>At least 8 characters</span>
                </div>
                <div className={styles.ruleItem}>
                  <span className={`${styles.ruleCheckbox} ${isUpper ? styles.valid : ''}`} />
                  <span>One uppercase letter</span>
                </div>
                <div className={styles.ruleItem}>
                  <span className={`${styles.ruleCheckbox} ${isLower ? styles.valid : ''}`} />
                  <span>One lowercase letter</span>
                </div>
                <div className={styles.ruleItem}>
                  <span className={`${styles.ruleCheckbox} ${isNumber ? styles.valid : ''}`} />
                  <span>One number</span>
                </div>
                <div className={styles.ruleItem}>
                  <span className={`${styles.ruleCheckbox} ${isSpecial ? styles.valid : ''}`} />
                  <span>One special character</span>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${showConfirmPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.submitBtn}
                disabled={!isPasswordValid || isLoading}
              >
                Reset password
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </button>
            </form>
          </div>
        );

      case 'reset_success':
        return (
          <div className={styles.resetFlowContainer}>
            <div className={styles.iconGraphicWrapper}>
              <div className={styles.successGraphic} />
            </div>
            <div className={styles.loginHeader}>
              <h2>Password updated!</h2>
              <p>Your password has been successfully changed.</p>
            </div>
            <div className={styles.loginForm}>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </button>
            </div>
          </div>
        );

      case 'reset_expired':
        return (
          <div className={styles.resetFlowContainer}>
            <div className={styles.iconGraphicWrapper}>
              <div className={styles.expiredGraphic} />
            </div>
            <div className={styles.loginHeader}>
              <h2>Link Expired!</h2>
              <p>This password reset link has expired. Please request a new link to continue.</p>
            </div>
            <div className={styles.loginForm}>
              <Button
                size="default"
                className={styles.submitBtn}
                onClick={() => setAuthView('forgot_request')}
              >
                Send a new link
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderView()}

      {isVerifyModalOpen && (
        <VerificationModal 
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          mode="password_reset"
          email={submittedResetEmail}
          onSuccess={() => { 
            setIsVerifyModalOpen(false);
            setAuthView('code_verified');
          }} 
        />
      )}
    </>
  );
};

export default AuthFlow;
