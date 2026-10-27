import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { resendEmailCode, verifyEmailCode } from '../../../../store/auth/authSlice';
import { Button } from '../../../../shared/components/Button';
import styles from './VerifyEmailModal.module.scss';

interface VerifyEmailModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyEmailModal = ({ email, isOpen, onClose }: VerifyEmailModalProps) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
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
      await dispatch(verifyEmailCode(fullCode)).unwrap();
      onClose();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Invalid code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    try {
      await dispatch(resendEmailCode()).unwrap();
      setCode(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = code.every(char => char !== '');

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.iconWrapper}>
          <span className={styles.mailIcon} />
        </div>

        <h2 className={styles.title}>Verify your email</h2>
        <p className={styles.subtitle}>
          We sent a 6-digit verification code to <span className={styles.emailText}>{email}</span>
        </p>

        <div className={styles.codeContainer} onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`${styles.digitInput} ${digit ? styles.filled : ''}`}
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
          {isVerifying ? 'Verifying...' : 'Verify email'}
        </Button>
      </div>
    </div>
  );
};