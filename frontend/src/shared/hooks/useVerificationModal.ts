import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { requestPasswordReset, resendEmailCode, verifyEmailCode } from '../../store/auth/authSlice';
import type { VerificationModalProps } from '../../modules/ProfilePage/components/VerifyEmailModal';

export const useVerificationModal = ({
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
      }
      
      if (onSuccess) {
        onSuccess(fullCode);
      }
      
      if (mode === 'email_verify') {
        onClose();
      }
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

  return {
    state: {
      code,
      isVerifying,
      isResending,
      error,
      isComplete,
      titleText,
      btnText,
    },
    refs: {
      inputRefs,
    },
    handlers: {
      handleChange,
      handleKeyDown,
      handlePaste,
      handleVerify,
      handleResend,
    },
  };
};