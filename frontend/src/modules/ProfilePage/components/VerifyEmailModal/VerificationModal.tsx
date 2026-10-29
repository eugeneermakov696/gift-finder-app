import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import {
  checkPasswordResetCode,
  requestPasswordReset,
  resendEmailCode,
  verifyEmailCode,
} from '../../../../store/auth/authSlice';
import { Button } from '../../../../shared/components/Button';
import styles from './VerificationModal.module.scss';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  mode: 'email_verify' | 'password_reset';
  onSuccess?: (code: string) => void;
}

export const VerificationModal = ({
  isOpen,
  onClose,
  email,
  mode,
  onSuccess,
}: VerificationModalProps) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsVerifying(true);
    setError(null);
    try {
      if (mode === 'email_verify') {
        await dispatch(verifyEmailCode(fullCode)).unwrap();
      } else if (mode === 'password_reset') {
        if (!email) {
          throw new Error('Email address is missing.');
        }
        await dispatch(checkPasswordResetCode({ email, code: fullCode })).unwrap();
      }

      if (onSuccess) {
        onSuccess(fullCode);
      }

      onClose();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Invalid code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    try {
      if (mode === 'email_verify') {
        await dispatch(resendEmailCode()).unwrap();
      } else if (mode === 'password_reset' && email) {
        await dispatch(requestPasswordReset(email)).unwrap();
      }

      setCode(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = code.every((char) => char !== '');

  const titleText = mode === 'email_verify' ? 'Verify your email' : 'Enter Reset Code';
  const btnText = isVerifying
    ? 'Verifying...'
    : mode === 'email_verify'
      ? 'Verify email'
      : 'Verify code';

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.iconWrapper}>
          <span className={styles.mailIcon} />
        </div>

        <h2 className={styles.title}>{titleText}</h2>
        <p className={styles.subtitle}>
          We sent a 6-digit verification code to{' '}
          {email ? <span className={styles.emailText}>{email}</span> : 'your email'}.
        </p>

        <div className={styles.codeContainer} onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`${styles.digitInput} ${digit ? styles.filled : ''} ${error ? styles.hasError : ''}`}
              disabled={isVerifying}
            />
          ))}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.resendBlock}>
          <p>
            Didn't receive the code?{' '}
            <button className={styles.resendBtn} onClick={handleResend} disabled={isResending}>
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </p>
          <p className={styles.expiresText}>Code expires in 15 minutes</p>
        </div>

        <Button
          size="large"
          variant="select"
          className={styles.verifyBtn}
          disabled={!isComplete || isVerifying}
          onClick={handleVerify}
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
};
