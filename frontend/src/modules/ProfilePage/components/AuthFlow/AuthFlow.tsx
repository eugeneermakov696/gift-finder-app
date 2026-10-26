import { useLocation, useSearchParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  confirmPasswordReset,
  fetchMe,
  loginUser,
  requestPasswordReset,
} from '../../../../store/auth/authSlice';
import { Button } from '../../../../shared/components/Button';
import type { RootState } from '../../../../store/store';
import styles from './AuthFlow.module.scss';

type AuthView =
  'login' | 'forgot_request' | 'forgot_sent' | 'reset_password' | 'reset_success' | 'reset_expired';

const AuthFlow = () => {
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

  // Creating new password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    } catch (error) {
      setLoginError(error as string);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const resetEmail = resetEmailRef.current?.value || '';

    try {
      await dispatch(requestPasswordReset(resetEmail)).unwrap();
      setAuthView('forgot_sent');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    const token = searchParams.get('reset_token');

    if (!token) {
      setAuthView('reset_expired');
      return;
    }

    try {
      await dispatch(confirmPasswordReset({ token, password: newPassword })).unwrap();
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
            <form className={styles.loginForm} onSubmit={handleLogin}>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Email</label>
                <input
                  type="email"
                  ref={loginEmailRef}
                  placeholder="Enter your Email"
                  className={`${styles.inputField} ${styles.withIconLeft}`}
                  onChange={() => setLoginError('')}
                  required
                />
              </div>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  ref={loginPasswordRef}
                  placeholder="Write your password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  onChange={() => setLoginError('')}
                  required
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${showPassword ? styles.eyeOpen : ''}`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {loginError && <div className={styles.errorMsg}>{loginError}</div>}

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.customCheckbox} />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => setAuthView('forgot_request')}
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
            <form className={styles.loginForm} onSubmit={handleRequestReset}>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Email</label>
                <input
                  type="email"
                  ref={resetEmailRef}
                  placeholder="Enter your Email"
                  className={`${styles.inputField} ${styles.withIconLeft}`}
                  required
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
              <Button
                size="default"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </Button>
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
            <form className={styles.loginForm} onSubmit={handleResetPassword}>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Create a new password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${showNewPassword ? styles.eyeOpen : ''}`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
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
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${showConfirmPassword ? styles.eyeOpen : ''}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.submitBtn}
                disabled={!isPasswordValid}
              >
                Reset password
              </Button>
              <Button
                size="default"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </Button>
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
              <Button
                size="default"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </Button>
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
              <Button
                size="default"
                className={styles.backToLoginBtn}
                onClick={() => setAuthView('login')}
              >
                Back to log in <span className={styles.arrowRightIcon} />
              </Button>
            </div>
          </div>
        );
    }
  };

  return <>{renderView()}</>;
};

export default AuthFlow;
