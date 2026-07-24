import * as React from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'outline' | 'pill';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps): React.ReactElement {
  const variantClass = variant === 'primary' ? styles.primary : variant === 'outline' ? styles.outline : styles.pill;
  return (
    <button className={`${styles.button} ${variantClass} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}
