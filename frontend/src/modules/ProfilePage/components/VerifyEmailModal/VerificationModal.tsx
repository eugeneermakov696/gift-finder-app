import { Button } from '../../../../shared/components/Button';
import { useVerificationModal } from '../../../../shared/hooks/useVerificationModal';
import styles from './VerificationModal.module.scss';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  mode: 'email_verify' | 'password_reset';
  onSuccess?: (code: string) => void;
}

export const VerificationModal = (props: VerificationModalProps) => {
  const { isOpen, onClose, email } = props;

  const { state, refs, handlers } = useVerificationModal(props);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.iconWrapper}>
          <span className={styles.mailIcon} />
        </div>

        <h2 className={styles.title}>{state.titleText}</h2>
        <p className={styles.subtitle}>
          We sent a 6-digit verification code to{' '}
          {email ? <span className={styles.emailText}>{email}</span> : 'your email'}.
        </p>

        <div className={styles.codeContainer} onPaste={handlers.handlePaste}>
          {state.code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                refs.inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlers.handleChange(index, e.target.value)}
              onKeyDown={(e) => handlers.handleKeyDown(index, e)}
              className={`${styles.digitInput} ${digit ? styles.filled : ''} ${state.error ? styles.hasError : ''}`}
              disabled={state.isVerifying}
            />
          ))}
        </div>

        {state.error && <p className={styles.errorMessage}>{state.error}</p>}

        <div className={styles.resendBlock}>
          <p>
            Didn't receive the code?{' '}
            <button
              className={styles.resendBtn}
              onClick={handlers.handleResend}
              disabled={state.isResending}
            >
              {state.isResending ? 'Sending...' : 'Resend code'}
            </button>
          </p>
          <p className={styles.expiresText}>Code expires in 15 minutes</p>
        </div>

        <Button
          size="large"
          variant="select"
          className={styles.verifyBtn}
          disabled={!state.isComplete || state.isVerifying}
          onClick={handlers.handleVerify}
        >
          {state.btnText}
        </Button>
      </div>
    </div>
  );
};
