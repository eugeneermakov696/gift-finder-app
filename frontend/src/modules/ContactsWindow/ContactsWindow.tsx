import { useEffect, useRef, useState } from 'react';
import styles from './ContactsWindow.module.scss';

interface ContactWindowProps {
  onClose: () => void;
}

export const ContactsWindow = ({ onClose }: ContactWindowProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [name, setName] = useState(() => localStorage.getItem('draftName') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('draftEmail') || '');
  const [message, setMessage] = useState(() => localStorage.getItem('draftMessage') || '');

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAutoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleAutoResize();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('send:', { name, email, message });

    setName('');
    setEmail('');
    setMessage('');

    localStorage.removeItem('draftName');
    localStorage.removeItem('draftEmail');
    localStorage.removeItem('draftMessage');

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
    >
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                localStorage.setItem('draftName', e.target.value);
              }}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                localStorage.setItem('draftEmail', e.target.value);
              }}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Message</label>
            <textarea
              ref={textareaRef}
              placeholder="Write your message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                localStorage.setItem('draftMessage', e.target.value);
              }}
              required
            />
            <span className={styles.helperText}>Tell us how we can help.</span>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};
