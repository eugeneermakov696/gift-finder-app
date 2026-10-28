import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearContactState, submitContactForm } from '../../store/contact/contactSlice';
import styles from './ContactsWindow.module.scss';
import { validator } from '../../shared/utils/validator';
import { useFormValidation } from '../../shared/hooks/useContactForm';

interface ContactWindowProps {
  onClose: () => void;
}

type FormFields = 'name' | 'email' | 'message';

export const ContactsWindow = ({ onClose }: ContactWindowProps) => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    successMessage,
    error: serverError,
  } = useAppSelector((state) => state.contact);

  // Initialize validation hook with field rules
  const { registerRef, errors, handleChange, validate, getValues, resetForm } =
    useFormValidation<FormFields>({
      name: {
        draftKey: 'draftName',
        validator: (v) => validator.validateName(v),
      },
      email: {
        draftKey: 'draftEmail',
        validator: (v) => validator.validateEmail(v),
      },
      message: {
        draftKey: 'draftMessage',
        validator: (v) => validator.validateMessage(v),
        isTextarea: true,
      },
    });

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      dispatch(clearContactState());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const { name, email, message } = getValues();

    try {
      await dispatch(submitContactForm({ name, email, message })).unwrap();
      resetForm();

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <span className={styles.closeIcon} />
        </button>

        <div className={styles.header}>
          <span className={styles.label}>Contact</span>
          <h2 className={styles.title}>Let’s connect</h2>
          <p className={styles.description}>
            For brands and retailers interested in partnerships, featured placements, or having
            products included in our gift recommendations, feel free to reach out.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={`${styles.inputGroup} ${errors.name ? styles.hasError : ''}`}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              ref={registerRef('name')}
              defaultValue={localStorage.getItem('draftName') || ''}
              onChange={handleChange('name')}
              disabled={isLoading}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={`${styles.inputGroup} ${errors.email ? styles.hasError : ''}`}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              ref={registerRef('email')}
              defaultValue={localStorage.getItem('draftEmail') || ''}
              onChange={handleChange('email')}
              disabled={isLoading}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={`${styles.inputGroup} ${errors.message ? styles.hasError : ''}`}>
            <label>Message</label>
            <textarea
              placeholder="Write your message"
              ref={registerRef('message')}
              defaultValue={localStorage.getItem('draftMessage') || ''}
              onChange={handleChange('message')}
              disabled={isLoading}
            />
            {errors.message ? (
              <span className={styles.errorText}>{errors.message}</span>
            ) : (
              <span className={styles.helperText}>Tell us how we can help.</span>
            )}
          </div>

          {serverError && <div className={styles.errorText}>{serverError}</div>}
          {successMessage && (
            <div style={{ color: 'var(--color-success-800)', fontSize: '14px' }}>{successMessage}</div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
};