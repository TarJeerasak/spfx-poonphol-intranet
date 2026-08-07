import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import styles from './KnowledgeImageGallery.module.scss';

export interface KnowledgeImageGalleryProps {
  images: string[];
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

export function KnowledgeImageGallery({ images }: KnowledgeImageGalleryProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const thumbnailStripRef = React.useRef<HTMLDivElement>(null);
  const thumbnailDragRef = React.useRef<ThumbnailDragState | undefined>(undefined);

  const handlePrevious = (): void => {
    setActiveIndex(current => (current - 1 + images.length) % images.length);
  };

  const handleNext = (): void => {
    setActiveIndex(current => (current + 1) % images.length);
  };

  React.useEffect(() => {
    const activeThumbnail = thumbnailStripRef.current?.querySelector(`[data-thumbnail-index="${activeIndex}"]`);
    if (!activeThumbnail) {
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeThumbnail.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'nearest', block: 'nearest' });
  }, [activeIndex]);

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
      setActiveIndex(dragState.pressedThumbnailIndex);
    }

    thumbnailDragRef.current = undefined;
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrap}>
        <div className={styles.mainImage} style={{ backgroundImage: `url(${images[activeIndex]})` }} />
        <button type="button" className={`${styles.navButton} ${styles.navButtonPrev}`} onClick={handlePrevious} aria-label="รูปก่อนหน้า">
          <Icon name="chevronLeft" size={20} />
        </button>
        <button type="button" className={`${styles.navButton} ${styles.navButtonNext}`} onClick={handleNext} aria-label="รูปถัดไป">
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
      <div
        ref={thumbnailStripRef}
        className={styles.thumbRow}
        onPointerDown={handleThumbnailStripPointerDown}
        onPointerMove={handleThumbnailStripPointerMove}
        onPointerUp={handleThumbnailStripPointerUp}
        onPointerCancel={handleThumbnailStripPointerUp}
      >
        {images.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            data-thumbnail-index={index}
            className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`ดูรูปที่ ${index + 1}`}
            aria-pressed={index === activeIndex}
          >
            <div className={styles.thumbImage} style={{ backgroundImage: `url(${url})` }} />
          </button>
        ))}
      </div>
    </div>
  );
}
