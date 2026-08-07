import * as React from 'react';
import { Icon } from '../Icon/Icon';
import styles from './ImageFallback.module.scss';

export interface ImageFallbackProps {
  imageUrl: string;
  className: string;
}

// Renders the same background-image div every image spot in the app already uses, but falls
// back to a neutral gradient + icon (instead of a bare color box) when there's genuinely no
// image to show - keeps items with missing images visually consistent with items that have one.
export function ImageFallback({ imageUrl, className }: ImageFallbackProps): React.ReactElement {
  if (!imageUrl) {
    return (
      <div className={`${className} ${styles.blank}`}>
        <Icon name="image" size={28} className={styles.blankIcon} />
      </div>
    );
  }

  return <div className={className} style={{ backgroundImage: `url(${imageUrl})` }} />;
}
