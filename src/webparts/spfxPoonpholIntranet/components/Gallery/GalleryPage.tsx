import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { ALBUM_CAROUSEL_PHOTO_COUNT, useAlbumPhotos } from '../../hooks/useAlbumPhotos';
import { useEventCategories } from '../../hooks/useEventCategories';
import { useGalleryFeed } from '../../hooks/useGalleryFeed';
import { GalleryAlbumMediaItem } from '../../services/galleryService';
import { AlbumLightbox } from './AlbumLightbox';
import { GalleryCarousel } from './GalleryCarousel';
import { GalleryCard } from './GalleryCard';
import styles from './GalleryPage.module.scss';

const ALL_CATEGORY_VALUE = 'all';
const INITIAL_VISIBLE_COUNT = 12;
const VISIBLE_COUNT_STEP = 12;
const BLANK_MEDIA_ITEM: GalleryAlbumMediaItem = { url: '', type: 'image' };

function padCarouselMedia(mediaItems: GalleryAlbumMediaItem[], minLength: number): GalleryAlbumMediaItem[] {
  if (mediaItems.length >= minLength) {
    return mediaItems;
  }
  return [...mediaItems, ...Array.from({ length: minLength - mediaItems.length }, () => BLANK_MEDIA_ITEM)];
}

export function GalleryPage(): React.ReactElement {
  const { items, isLoading } = useGalleryFeed();
  const { categories } = useEventCategories();
  const categoryTabs = React.useMemo(
    () => [{ id: ALL_CATEGORY_VALUE, label: 'ดูทั้งหมด' }, ...categories.map(category => ({ id: category.id, label: category.label }))],
    [categories]
  );
  const [categoryId, setCategoryId] = React.useState(ALL_CATEGORY_VALUE);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [selectedAlbumId, setSelectedAlbumId] = React.useState<string | undefined>(undefined);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | undefined>(undefined);
  const pageRef = React.useRef<HTMLDivElement>(null);

  const handleAlbumSelect = (albumId: string): void => {
    setSelectedAlbumId(albumId);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pageRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  React.useEffect(() => {
    if (!selectedAlbumId && items.length > 0) {
      setSelectedAlbumId(items[0].id);
    }
  }, [items, selectedAlbumId]);

  const selectedAlbum = items.find(item => item.id === selectedAlbumId);
  const { mediaItems } = useAlbumPhotos(selectedAlbum?.folderUrl);
  const carouselMedia = padCarouselMedia(mediaItems, ALBUM_CAROUSEL_PHOTO_COUNT);

  const filteredItems = items
    .filter(item => categoryId === ALL_CATEGORY_VALUE || item.categoryId === categoryId)
    .filter(item => search.trim().length === 0 || item.title.toLowerCase().includes(search.trim().toLowerCase()));

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleCategorySelect = (nextCategoryId: string): void => {
    setCategoryId(nextCategoryId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setSearch(searchDraft);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleSearchClear = (): void => {
    setSearchDraft('');
    setSearch('');
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <div className={styles.page} ref={pageRef}>
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Gallery</h1>
          <p className={styles.bannerSubtitle}>รวมภาพกิจกรรมและบรรยากาศของกลุ่มพูลผล</p>
        </div>
      </section>

      <div className={styles.container}>
        {selectedAlbum && <GalleryCarousel key={selectedAlbum.id} media={carouselMedia} onMediaClick={setLightboxIndex} />}

        {selectedAlbum && lightboxIndex !== undefined && (
          <AlbumLightbox
            media={mediaItems}
            title={selectedAlbum.title}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(undefined)}
          />
        )}

        <section className={styles.filterBar}>
          <div className={styles.categoryTabs}>
            {categoryTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.categoryTab} ${categoryId === tab.id ? styles.categoryTabActive : ''}`}
                onClick={() => handleCategorySelect(tab.id)}
                aria-pressed={categoryId === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <span className={styles.searchBox}>
              <span className={styles.searchIcon}>
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="ค้นหารูปภาพ"
                value={searchDraft}
                onChange={event => setSearchDraft(event.target.value)}
                aria-label="ค้นหารูปภาพ"
              />
              {searchDraft.length > 0 && (
                <button type="button" className={styles.searchClearButton} onClick={handleSearchClear} aria-label="ล้างคำค้นหา">
                  <Icon name="close" size={14} />
                </button>
              )}
            </span>
            <button type="submit" className={styles.searchButton}>
              ค้นหา
            </button>
          </form>
        </section>

        {isLoading ? (
          <p className={styles.stateMessage}>กำลังโหลด...</p>
        ) : visibleItems.length > 0 ? (
          <div className={styles.cardGrid}>
            {visibleItems.map(item => (
              <GalleryCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedAlbumId}
                onSelect={() => handleAlbumSelect(item.id)}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>ไม่พบรูปภาพที่ตรงกับเงื่อนไขที่เลือก</p>
        )}

        {hasMore && (
          <div className={styles.viewMoreRow}>
            <button type="button" className={styles.viewMoreButton} onClick={() => setVisibleCount(current => current + VISIBLE_COUNT_STEP)}>
              ดูทั้งหมด
              <Icon name="chevronDown" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
