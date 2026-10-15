import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean = true) => {
  useEffect(() => {
    if (!isLocked) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
};