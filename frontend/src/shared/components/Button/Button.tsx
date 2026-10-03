import React from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'select' | 'choice2' | 'text';
type ButtonSize = 'default' | 'large' | 'extraLarge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) => {
  
  const combinedClassName = `
    ${styles.btn} 
    ${styles[variant]} 
    ${styles[size]} 
    ${className}
  `.trim();

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};