import { VerificationModal } from '../VerifyEmailModal';
import { useAuthFlow } from '../../../../shared/hooks/useAuthFlow';
import { Button } from '../../../../shared/components/Button';
import styles from './AuthFlow.module.scss';

export const AuthFlow = () => {
  const { state, refs, actions, handlers } = useAuthFlow();

  const renderView = () => {
    switch (state.authView) {
      case 'login':
        return (
          <>
            <div className={styles.loginHeader}>
              <h2>Already have an account?</h2>
              <p>Welcome back! Log in to access your favorites, gift lists, and more.</p>
            </div>
            <form className={styles.loginForm} onSubmit={handlers.handleLogin} noValidate>
              <div className={`${styles.inputWrapper} ${state.loginError ? styles.hasError : ''}`}>
                <label className={styles.floatingLabel}>Email</label>
                <span className={styles.emailIcon} />
                <input
                  type="email"
                  ref={refs.loginEmailRef}
                  placeholder="Enter your Email"
                  className={`${styles.inputField} ${styles.withIconLeft}`}
                  onChange={() => actions.setLoginError('')}
                  required
                  disabled={state.isLoading}
                />
              </div>

              <div className={`${styles.inputWrapper} ${state.loginError ? styles.hasError : ''}`}>
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={state.showPassword ? 'text' : 'password'}
                  ref={refs.loginPasswordRef}
                  placeholder="Write your password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  onChange={() => actions.setLoginError('')}
                  required
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${state.showPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                  onClick={() => actions.setShowPassword(!state.showPassword)}
                  aria-label={state.showPassword ? 'Hide password' : 'Show password'}
                  disabled={state.isLoading}
                />
              </div>

              {state.loginError && (
                <div
                  className={styles.errorMsg}
                  style={{ position: 'relative', marginTop: '-8px', marginBottom: '0' }}
                >
                  {state.loginError}
                </div>
              )}

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.customCheckbox}
                    disabled={state.isLoading}
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => actions.setAuthView('forgot_request')}
                  disabled={state.isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.loginBtn}
                disabled={state.isLoading}
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
                Enter the email address associated with your account, and we'll send you a code to
                reset your password.
              </p>
            </div>
            <form className={styles.loginForm} onSubmit={handlers.handleRequestReset} noValidate>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Email</label>
                <span className={styles.emailIcon} />
                <input
                  type="email"
                  ref={refs.resetEmailRef}
                  placeholder="Enter your Email"
                  className={`${styles.inputField} ${styles.withIconLeft}`}
                  required
                  disabled={state.isLoading}
                />
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.submitBtn}
                disabled={state.isLoading}
              >
                {state.isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => actions.setAuthView('login')}
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
              <p>We’ve sent a password reset code to your email.</p>
            </div>
            <div className={styles.loginForm}>
              <Button
                variant="select"
                size="large"
                onClick={() => actions.setIsVerifyModalOpen(true)}
              >
                Enter verification code
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => actions.setAuthView('login')}
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
              <Button
                variant="select"
                size="large"
                onClick={() => actions.setAuthView('reset_password')}
              >
                Create new password
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => actions.setAuthView('login')}
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
              <h2>Create new password</h2>
            </div>
            <form className={styles.loginForm} onSubmit={handlers.handleResetPassword} noValidate>
              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Password</label>
                <input
                  type={state.showNewPassword ? 'text' : 'password'}
                  placeholder="Create a new password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  value={state.newPassword}
                  onChange={(e) => actions.setNewPassword(e.target.value)}
                  required
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${state.showNewPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                  onClick={() => actions.setShowNewPassword(!state.showNewPassword)}
                  aria-label={state.showNewPassword ? 'Hide password' : 'Show password'}
                  disabled={state.isLoading}
                />
              </div>

              <div className={styles.passwordRules}>
                <div className={styles.ruleItem}>
                  <span
                    className={`${styles.ruleCheckbox} ${state.passwordRules.isLength ? styles.valid : ''}`}
                  />
                  <span>At least 8 characters</span>
                </div>
                <div className={styles.ruleItem}>
                  <span
                    className={`${styles.ruleCheckbox} ${state.passwordRules.isUpper ? styles.valid : ''}`}
                  />
                  <span>One uppercase letter</span>
                </div>
                <div className={styles.ruleItem}>
                  <span
                    className={`${styles.ruleCheckbox} ${state.passwordRules.isLower ? styles.valid : ''}`}
                  />
                  <span>One lowercase letter</span>
                </div>
                <div className={styles.ruleItem}>
                  <span
                    className={`${styles.ruleCheckbox} ${state.passwordRules.isNumber ? styles.valid : ''}`}
                  />
                  <span>One number</span>
                </div>
                <div className={styles.ruleItem}>
                  <span
                    className={`${styles.ruleCheckbox} ${state.passwordRules.isSpecial ? styles.valid : ''}`}
                  />
                  <span>One special character</span>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.floatingLabel}>Confirm Password</label>
                <input
                  type={state.showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`${styles.inputField} ${styles.withIconRight}`}
                  value={state.confirmNewPassword}
                  onChange={(e) => actions.setConfirmNewPassword(e.target.value)}
                  required
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  className={`${styles.eyeIcon} ${state.showConfirmPassword ? styles.eyeIconOpen : styles.eyeIconClosed}`}
                  onClick={() => actions.setShowConfirmPassword(!state.showConfirmPassword)}
                  aria-label={
                    state.showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                  disabled={state.isLoading}
                />
              </div>
              <Button
                variant="select"
                size="large"
                type="submit"
                className={styles.submitBtn}
                disabled={!state.isPasswordValid || state.isLoading}
              >
                Reset password
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => actions.setAuthView('login')}
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
                onClick={() => actions.setAuthView('login')}
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
                onClick={() => actions.setAuthView('forgot_request')}
              >
                Send a new link
              </Button>
              <button
                type="button"
                className={styles.backToLoginBtn}
                onClick={() => actions.setAuthView('login')}
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

      {state.isVerifyModalOpen && (
        <VerificationModal
          isOpen={state.isVerifyModalOpen}
          onClose={() => actions.setIsVerifyModalOpen(false)}
          mode="password_reset"
          email={state.submittedResetEmail}
          onSuccess={(code) => {
            actions.searchParams.set('reset_token', code);
            actions.setSearchParams(actions.searchParams);

            actions.setIsVerifyModalOpen(false);
            actions.setAuthView('code_verified');
          }}
        />
      )}
    </>
  );
};

export default AuthFlow;
