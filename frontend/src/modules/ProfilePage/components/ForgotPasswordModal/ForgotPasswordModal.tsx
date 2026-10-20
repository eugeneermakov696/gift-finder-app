import { useState } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { requestPasswordReset } from '../../../../store/auth/authSlice';
import { Button } from '../../../../shared/components/Button';
import styles from './ForgotPasswordModal.module.scss';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [localMessage, setLocalMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail('');
    setLocalMessage('');
    setLocalError('');
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalMessage('');
    setLocalError('');
    setIsLoading(true);

    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      setLocalMessage('If an account with this email address exists, we have sent password recovery instructions to it.');
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : 'Failed to sent request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Reset Password</h2>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <span className={styles.emailIcon} />
              <input
                type="email"
                placeholder="Email address"
                className={`${styles.inputField} ${styles.withIconLeft}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {localError && <div className={styles.errorMsg}>{localError}</div>}
          {localMessage && <div className={styles.successMsg}>{localMessage}</div>}

          <Button variant="primary" size="large" type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};