import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { GalleryAlbumMediaItem } from '../../services/galleryService';
import styles from './GalleryCarousel.module.scss';

export interface GalleryCarouselProps {
  media: GalleryAlbumMediaItem[];
  onMediaClick: (mediaIndex: number) => void;
}

const VISIBLE_SLOT_COUNT = 5;
const CENTER_SLOT_INDEX = 2;
const DRAG_THRESHOLD_PX = 50;

interface DragState {
  startX: number;
  hasTriggered: boolean;
  pressedMediaIndex: number | undefined;
}

function getMediaIndexFromEventTarget(target: EventTarget): number | undefined {
  if (!(target instanceof Element)) {
    return undefined;
  }
  const slideElement = target.closest('[data-media-index]');
  const rawIndex = slideElement?.getAttribute('data-media-index');
  return rawIndex ? Number(rawIndex) : undefined;
}

function getSlideClassName(offset: number): string {
  if (offset === CENTER_SLOT_INDEX) {
    return styles.center;
  }
  if (offset === 1 || offset === 3) {
    return styles.near;
  }
  return styles.far;
}

export function GalleryCarousel({ media, onMediaClick }: GalleryCarouselProps): React.ReactElement {
  const [startIndex, setStartIndex] = React.useState(0);

  // Warm the browser cache for every photo in the album up front - these are full-size photos
  // straight from SharePoint (often several MB each), so without this, revealing a not-yet-seen
  // photo via next/previous triggers a fresh multi-MB download at the moment of the click. Videos
  // preload their own metadata lazily via the <video> element, so this only targets images.
  React.useEffect(() => {
    media.forEach(item => {
      if (!item.url || item.type !== 'image') {
        return;
      }
      const preloadImage = new Image();
      preloadImage.src = item.url;
    });
  }, [media]);

  const handlePrevious = (): void => {
    setStartIndex(current => (current - 1 + media.length) % media.length);
  };

  const handleNext = (): void => {
    setStartIndex(current => (current + 1) % media.length);
  };

  const dragStateRef = React.useRef<DragState | undefined>(undefined);

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    // Capturing the pointer here would also swallow clicks on the prev/next buttons and on the
    // native <video> controls (they're descendants of the track), since capture retargets the
    // eventual pointerup/click to this element instead of them - so skip drag entirely when the
    // press starts on either. The icon inside the button is an SVG, not an HTMLElement, so check
    // against Element instead (their common ancestor interface) or it would slip through.
    if (event.target instanceof Element && (event.target.closest('button') || event.target.closest('video'))) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      hasTriggered: false,
      pressedMediaIndex: getMediaIndexFromEventTarget(event.target)
    };
  };

  const handleTrackPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.hasTriggered) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (deltaX <= -DRAG_THRESHOLD_PX) {
      dragState.hasTriggered = true;
      handleNext();
    } else if (deltaX >= DRAG_THRESHOLD_PX) {
      dragState.hasTriggered = true;
      handlePrevious();
    }
  };

  const handleTrackPointerEnd = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const dragState = dragStateRef.current;
    if (dragState && !dragState.hasTriggered && dragState.pressedMediaIndex !== undefined) {
      if (media[dragState.pressedMediaIndex]?.url) {
        onMediaClick(dragState.pressedMediaIndex);
      }
    }

    dragStateRef.current = undefined;
  };

  const visibleSlots = Array.from({ length: Math.min(VISIBLE_SLOT_COUNT, media.length) }, (_unused, offset) => {
    const mediaIndex = (startIndex + offset) % media.length;
    return { item: media[mediaIndex], mediaIndex, offset };
  });

  return (
    <div className={styles.carousel}>
      <div
        className={styles.track}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerEnd}
        onPointerCancel={handleTrackPointerEnd}
      >
        {visibleSlots.map(slot => (
          <div
            key={slot.offset}
            data-media-index={slot.mediaIndex}
            className={`${styles.slide} ${getSlideClassName(slot.offset)} ${slot.item.url ? '' : styles.blank}`}
            style={{ zIndex: slot.offset === CENTER_SLOT_INDEX ? 3 : 2 - Math.abs(slot.offset - CENTER_SLOT_INDEX) }}
          >
            {slot.item.url ? (
              slot.item.type === 'video' ? (
                <video key={slot.item.url} className={styles.videoLayer} src={slot.item.url} controls playsInline preload="metadata" />
              ) : (
                <div key={slot.item.url} className={styles.imageLayer} style={{ backgroundImage: `url(${slot.item.url})` }} />
              )
            ) : (
              <Icon name="image" size={28} className={styles.blankIcon} />
            )}
          </div>
        ))}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonPrev}`}
          onClick={handlePrevious}
          aria-label="รูปก่อนหน้า"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonNext}`}
          onClick={handleNext}
          aria-label="รูปถัดไป"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}
