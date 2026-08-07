import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { GalleryAlbumMediaItem } from '../../services/galleryService';
import styles from './AlbumLightbox.module.scss';

export interface AlbumLightboxProps {
  media: GalleryAlbumMediaItem[];
  title: string;
  startIndex: number;
  onClose: () => void;
}

const THUMBNAIL_DRAG_THRESHOLD_PX = 6;

interface ThumbnailDragState {
  startX: number;
  scrollLeftStart: number;
  hasDragged: boolean;
  pressedThumbnailIndex: number | undefined;
}

function getThumbnailIndexFromEventTarget(target: EventTarget): number | undefined {
  if (!(target instanceof Element)) {
    return undefined;
  }
  const thumbnailElement = target.closest('[data-thumbnail-index]');
  const rawIndex = thumbnailElement?.getAttribute('data-thumbnail-index');
  return rawIndex ? Number(rawIndex) : undefined;
}

export function AlbumLightbox({ media, title, startIndex, onClose }: AlbumLightboxProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const hasMultipleItems = media.length > 1;
  const currentItem = media[currentIndex];
  const thumbnailStripRef = React.useRef<HTMLDivElement>(null);
  const thumbnailDragRef = React.useRef<ThumbnailDragState | undefined>(undefined);

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex(current => (current - 1 + media.length) % media.length);
  }, [media.length]);

  const goToNext = React.useCallback(() => {
    setCurrentIndex(current => (current + 1) % media.length);
  }, [media.length]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft' && hasMultipleItems) {
        goToPrevious();
      } else if (event.key === 'ArrowRight' && hasMultipleItems) {
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
  }, [onClose, goToPrevious, goToNext, hasMultipleItems]);

  React.useEffect(() => {
    const activeThumbnail = thumbnailStripRef.current?.querySelector(`[data-thumbnail-index="${currentIndex}"]`);
    if (!activeThumbnail) {
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeThumbnail.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  }, [currentIndex]);

  const handleThumbnailStripPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    event.currentTarget.setPointerCapture(event.pointerId);
    thumbnailDragRef.current = {
      startX: event.clientX,
      scrollLeftStart: event.currentTarget.scrollLeft,
      hasDragged: false,
      pressedThumbnailIndex: getThumbnailIndexFromEventTarget(event.target)
    };
  };

  const handleThumbnailStripPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const dragState = thumbnailDragRef.current;
    if (!dragState) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > THUMBNAIL_DRAG_THRESHOLD_PX) {
      dragState.hasDragged = true;
    }
    event.currentTarget.scrollLeft = dragState.scrollLeftStart - deltaX;
  };

  const handleThumbnailStripPointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const dragState = thumbnailDragRef.current;
    if (dragState && !dragState.hasDragged && dragState.pressedThumbnailIndex !== undefined) {
      setCurrentIndex(dragState.pressedThumbnailIndex);
    }

    thumbnailDragRef.current = undefined;
  };

  // Keyboard-only activation (Tab + Enter/Space) never goes through pointer capture, so this
  // stays reachable for keyboard users even though mouse/touch selection is handled above.
  const handleThumbnailKeyboardSelect = (index: number): void => {
    setCurrentIndex(index);
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="ปิด">
          <Icon name="close" size={18} />
        </button>

        <p className={styles.title}>{title}</p>

        <div className={styles.stage}>
          {currentItem.type === 'video' ? (
            <video key={currentItem.url} className={styles.stageMedia} src={currentItem.url} controls playsInline />
          ) : (
            <img key={currentItem.url} src={currentItem.url} alt="" className={styles.stageMedia} />
          )}

          {hasMultipleItems && (
            <>
              <button type="button" className={`${styles.clickZone} ${styles.clickZoneLeft}`} onClick={goToPrevious} aria-label="รูปก่อนหน้า">
                <Icon name="chevronLeft" size={22} className={styles.clickZoneIcon} />
              </button>
              <button type="button" className={`${styles.clickZone} ${styles.clickZoneRight}`} onClick={goToNext} aria-label="รูปถัดไป">
                <Icon name="chevronRight" size={22} className={styles.clickZoneIcon} />
              </button>
            </>
          )}
        </div>

        {hasMultipleItems && (
          <span className={styles.counter}>
            {currentIndex + 1}/{media.length}
          </span>
        )}

        {hasMultipleItems && (
          <div
            ref={thumbnailStripRef}
            className={styles.thumbnailStrip}
            onPointerDown={handleThumbnailStripPointerDown}
            onPointerMove={handleThumbnailStripPointerMove}
            onPointerUp={handleThumbnailStripPointerUp}
            onPointerCancel={handleThumbnailStripPointerUp}
          >
            {media.map((item, index) => (
              <button
                key={item.url}
                type="button"
                data-thumbnail-index={index}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                style={item.type === 'image' ? { backgroundImage: `url(${item.url})` } : undefined}
                onClick={() => handleThumbnailKeyboardSelect(index)}
                aria-label={`รูปที่ ${index + 1}`}
                aria-current={index === currentIndex}
              >
                {item.type === 'video' && <Icon name="play" size={18} className={styles.thumbnailPlayIcon} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
