import * as React from 'react';
import styles from './Tag.module.scss';

export interface TagProps {
  label: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
}

export function Tag({ label, color, textColor, borderColor, className }: TagProps): React.ReactElement {
  return (
    <span
      className={`${styles.tag} ${className ?? ''}`}
      style={{
        ...(color ? { backgroundColor: color } : undefined),
        ...(textColor ? { color: textColor } : undefined),
        ...(borderColor ? { border: `1px solid ${borderColor}` } : undefined)
      }}
    >
      {label}
    </span>
  );
}
