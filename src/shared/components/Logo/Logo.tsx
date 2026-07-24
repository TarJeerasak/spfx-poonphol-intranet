import * as React from 'react';
import logoUrl from '../../assets/logo-poonphol.png';
import styles from './Logo.module.scss';

export interface LogoProps {
  height?: number;
  className?: string;
}

// The source export is a large sprite sheet with the mark cropped into one
// corner (a Figma "instance swap" fill) rather than a tightly cropped logo
// image, so it's displayed through a fixed-ratio, overflow-hidden window with
// the image scaled/offset to reveal only the mark, matching the Figma layer.
export function Logo({ height = 40, className }: LogoProps): React.ReactElement {
  const width = height * (187 / 80);
  return (
    <span className={`${styles.wrap} ${className ?? ''}`} style={{ width, height }}>
      <img src={logoUrl} alt="Poonphol Group" className={styles.img} />
    </span>
  );
}
