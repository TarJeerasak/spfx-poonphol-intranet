import * as React from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { Dropdown } from '../../../../shared/components/Dropdown/Dropdown';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Modal } from '../../../../shared/components/Modal/Modal';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { useMoreAppsFeed } from '../../hooks/useMoreAppsFeed';
import { MAX_FAVORITE_APPS_PER_USER } from '../../services/favoriteAppsService';
import { AppTab, getAppCategory } from '../../services/moreAppsService';
import heroIllustration from '../../assets/more-apps/hero-illustration.png';
import { AppCard } from './AppCard';
import { AppListRow } from './AppListRow';
import styles from './MoreAppsPage.module.scss';

interface TabDefinition {
  id: AppTab;
  label: string;
}

const TABS: TabDefinition[] = [
  { id: 'all', label: 'ดูทั้งหมด' },
  { id: 'favorites', label: 'ชื่นชอบ' },
  { id: 'recent', label: 'ใช้งานล่าสุด' },
  { id: 'frequent', label: 'ใช้งานบ่อย' },
  { id: 'new', label: 'แอปพลิเคชันใหม่' }
];

// Below this count the 4-column card grid leaves the row looking sparse, so the
// design switches to a full-width list layout (see Figma node 53365:37825) instead.
const LIST_LAYOUT_MAX_ITEMS = 3;

export function MoreAppsPage(): React.ReactElement {
  const {
    items,
    categories,
    filteredCount,
    filters,
    favoriteIds,
    canExpand,
    isExpanded,
    isFavoriteLimitReached,
    setSearch,
    setCategory,
    setTab,
    toggleFavorite,
    recordUsage,
    toggleExpanded,
    dismissFavoriteLimitNotice
  } = useMoreAppsFeed();

  const categoryOptions = [
    { value: 'All', label: 'ทุกหมวดหมู่' },
    ...categories.map(category => ({ value: category.id, label: category.label }))
  ];

  const [searchDraft, setSearchDraft] = React.useState(filters.search);
  const [gridRef, isGridVisible] = useScrollReveal<HTMLDivElement>();

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setSearch(searchDraft);
  };

  const handleSearchClear = (): void => {
    setSearchDraft('');
    setSearch('');
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero} style={{ backgroundImage: `url(${heroIllustration})` }}>
        <div className={styles.heroFade} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>More Apps</h1>
          <p className={styles.heroSubtitle}>
            รวมทุกแอปพลิเคชั่นที่คุณต้องใช้
            <br />
            เพื่อการทำงานที่ง่ายและมีประสิทธิภาพ
          </p>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.filterPanel}>
          <div className={styles.tabRow}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabButton} ${filters.tab === tab.id ? styles.tabButtonActive : ''}`}
                onClick={() => setTab(tab.id)}
                aria-pressed={filters.tab === tab.id}
              >
                {tab.label}
              </button>
            ))}
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
                  aria-label="ค้นหาแอปพลิเคชัน"
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
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>แอปพลิเคชันทั้งหมด</p>
            <div className={styles.panelControls}>
              <Dropdown label="กรองตามหมวดหมู่" value={filters.categoryId} options={categoryOptions} onChange={setCategory} />
            </div>
          </div>
          <div className={styles.panelDivider} />

          {items.length === 0 ? (
            <p className={styles.emptyState}>ไม่พบแอปพลิเคชันที่ตรงกับเงื่อนไข</p>
          ) : items.length <= LIST_LAYOUT_MAX_ITEMS ? (
            <div ref={gridRef} className={`${styles.list} ${isGridVisible ? styles.isVisible : ''}`}>
              {items.map((app, index) => (
                <AppListRow
                  key={app.id}
                  app={app}
                  category={getAppCategory(categories, app.categoryId)}
                  isFavorite={favoriteIds.has(app.id)}
                  isVisible={isGridVisible}
                  revealDelay={index * 45}
                  onToggleFavorite={() => toggleFavorite(app.id)}
                  onOpen={() => recordUsage(app.id)}
                />
              ))}
            </div>
          ) : (
            <div ref={gridRef} className={`${styles.grid} ${isGridVisible ? styles.isVisible : ''}`}>
              {items.map((app, index) => (
                <AppCard
                  key={app.id}
                  app={app}
                  category={getAppCategory(categories, app.categoryId)}
                  isFavorite={favoriteIds.has(app.id)}
                  isVisible={isGridVisible}
                  revealDelay={Math.min(index, 11) * 45}
                  onToggleFavorite={() => toggleFavorite(app.id)}
                  onOpen={() => recordUsage(app.id)}
                />
              ))}
            </div>
          )}

          {canExpand && (
            <button type="button" className={styles.viewAllButton} onClick={toggleExpanded}>
              {isExpanded ? 'แสดงน้อยลง' : `ดูทั้งหมด (${filteredCount})`}
              <Icon name="chevronDown" size={16} className={`${styles.chevronIcon} ${isExpanded ? styles.chevronUp : ''}`} />
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isFavoriteLimitReached}
        onClose={dismissFavoriteLimitNotice}
        title="เพิ่มรายการโปรดไม่ได้"
        footer={
          <Button variant="primary" style={{ minWidth: 112, padding: '10px 20px' }} onClick={dismissFavoriteLimitNotice}>
            เข้าใจแล้ว
          </Button>
        }
      >
        <p className={styles.favoriteLimitMessage}>
          คุณเลือกแอปพลิเคชันโปรดไว้ครบ {MAX_FAVORITE_APPS_PER_USER} รายการแล้ว กรุณานำรายการเดิมออกก่อนเพิ่มรายการใหม่
        </p>
      </Modal>
    </div>
  );
}
