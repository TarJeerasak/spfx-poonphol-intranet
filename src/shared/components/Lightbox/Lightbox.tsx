import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../Icon/Icon';
import styles from './Lightbox.module.scss';

export interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, startIndex, onClose }: LightboxProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const hasMultipleImages = images.length > 1;

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex(current => (current - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = React.useCallback(() => {
    setCurrentIndex(current => (current + 1) % images.length);
  }, [images.length]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft' && hasMultipleImages) {
        goToPrevious();
      } else if (event.key === 'ArrowRight' && hasMultipleImages) {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goToPrevious, goToNext, hasMultipleImages]);

  return ReactDOM.createPortal(
    // Click-to-close and the nav buttons must both react to the "click" event - mixing
    // onMouseDown (overlay) with onClick (buttons) let mousedown close the lightbox before
    // the button's click/stopPropagation ever ran, so navigation looked like it closed the popup.
    <div className={styles.overlay} onClick={onClose}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="ปิด">
        <Icon name="close" size={22} />
      </button>

      {hasMultipleImages && (
        <span className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </span>
      )}

      <div className={styles.stage} onClick={event => event.stopPropagation()}>
        {hasMultipleImages && (
          <button type="button" className={styles.navButton} onClick={goToPrevious} aria-label="รูปก่อนหน้า">
            <Icon name="arrowLeft" size={18} />
          </button>
        )}

        <img src={images[currentIndex]} alt="" className={styles.image} />

        {hasMultipleImages && (
          <button type="button" className={styles.navButton} onClick={goToNext} aria-label="รูปถัดไป">
            <Icon name="arrowRight" size={18} />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
