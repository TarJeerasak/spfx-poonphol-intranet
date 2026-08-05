import * as React from 'react';
import { Dropdown } from '../../../../shared/components/Dropdown/Dropdown';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { useAllEventsFeed } from '../../hooks/useAllEventsFeed';
import { useEventCategories } from '../../hooks/useEventCategories';
import bannerImageUrl from '../../assets/events/hero-banner.jpg';
import { EventsListRow } from './EventsListRow';
import styles from './EventsPage.module.scss';

const ALL_CATEGORY_VALUE = 'all';
const INITIAL_VISIBLE_COUNT = 8;
const VISIBLE_COUNT_STEP = 8;

type SortOrder = 'date' | 'name';

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'name', label: 'ชื่อกิจกรรม' }
];

export function EventsPage(): React.ReactElement {
  const { items, isLoading } = useAllEventsFeed();
  const { categories } = useEventCategories();
  const categoryTabs = React.useMemo(
    () => [{ id: ALL_CATEGORY_VALUE, label: 'ดูทั้งหมด' }, ...categories.map(category => ({ id: category.id, label: category.label }))],
    [categories]
  );
  const [categoryId, setCategoryId] = React.useState(ALL_CATEGORY_VALUE);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('date');
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [search, setSearch] = React.useState('');

  const filteredItems = items
    .filter(item => categoryId === ALL_CATEGORY_VALUE || item.categoryId === categoryId)
    .filter(item => search.trim().length === 0 || item.title.toLowerCase().includes(search.trim().toLowerCase()));

  if (sortOrder === 'name') {
    filteredItems.sort((a, b) => a.title.localeCompare(b.title, 'th'));
  }

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
    <div className={styles.page}>
      <section className={styles.banner} style={{ backgroundImage: `url(${bannerImageUrl})` }}>
        <div className={styles.bannerFade} />
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Events</h1>
          <p className={styles.bannerSubtitle}>
            ติดตามกิจกรรม การอบรม และอีเวนต์ต่าง ๆ
            <br />
            ของกลุ่มพูลผล
          </p>
        </div>
      </section>

      <div className={styles.container}>
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
                placeholder="ค้นหา"
                value={searchDraft}
                onChange={event => setSearchDraft(event.target.value)}
                aria-label="ค้นหากิจกรรม"
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

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>กิจกรรม</p>
            <div className={styles.sortControl}>
              <span className={styles.sortLabel}>Sort by:</span>
              <Dropdown
                label="เรียงลำดับ"
                value={sortOrder}
                options={SORT_OPTIONS}
                onChange={value => setSortOrder(value as SortOrder)}
              />
            </div>
          </div>
          <div className={styles.panelDivider} />

          {isLoading ? (
            <p className={styles.stateMessage}>กำลังโหลด...</p>
          ) : visibleItems.length > 0 ? (
            <div className={styles.list}>
              {visibleItems.map(item => (
                <EventsListRow key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyMessage}>ไม่พบกิจกรรมที่ตรงกับเงื่อนไขที่เลือก</p>
          )}

          {hasMore && (
            <div className={styles.viewMoreRow}>
              <button
                type="button"
                className={styles.viewMoreButton}
                onClick={() => setVisibleCount(current => current + VISIBLE_COUNT_STEP)}
              >
                ดูทั้งหมด
                <Icon name="chevronDown" size={16} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
