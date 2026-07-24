import * as React from 'react';
import styles from './Tag.module.scss';

export interface TagProps {
  label: string;
  color?: string;
  className?: string;
}

export function Tag({ label, color, className }: TagProps): React.ReactElement {
  return (
    <span className={`${styles.tag} ${className ?? ''}`} style={color ? { backgroundColor: color } : undefined}>
      {label}
    </span>
  );
}
