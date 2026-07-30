import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { useMoreAppsFeed } from '../../hooks/useMoreAppsFeed';
import { APP_CATEGORIES, APP_COMPANIES, AppTab, getAppCategory } from '../../services/moreAppsService';
import heroIllustration from '../../assets/more-apps/hero-illustration.png';
import { AppCard } from './AppCard';
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

const COMPANY_OPTIONS = [{ value: 'All', label: 'ทุกบริษัท' }, ...APP_COMPANIES.map(value => ({ value, label: value }))];

const CATEGORY_OPTIONS = [
  { value: 'All', label: 'ทุกหมวดหมู่' },
  ...APP_CATEGORIES.map(category => ({ value: category.id, label: category.label }))
];

export function MoreAppsPage(): React.ReactElement {
  const {
    items,
    filteredCount,
    filters,
    favoriteIds,
    canExpand,
    isExpanded,
    setSearch,
    setCompany,
    setCategory,
    setTab,
    toggleFavorite,
    toggleExpanded
  } = useMoreAppsFeed();

  const [searchDraft, setSearchDraft] = React.useState(filters.search);
  const [gridRef, isGridVisible] = useScrollReveal<HTMLDivElement>();

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setSearch(searchDraft);
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
                  placeholder="search"
                  value={searchDraft}
                  onChange={event => setSearchDraft(event.target.value)}
                  aria-label="ค้นหาแอปพลิเคชัน"
                />
              </span>
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </form>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>แอปพลิเคชันทั้งหมด</p>
            <div className={styles.panelControls}>
              <label className={styles.selectWrap}>
                <span className={styles.visuallyHidden}>กรองตามบริษัท</span>
                <select className={styles.select} value={filters.company} onChange={event => setCompany(event.target.value)}>
                  {COMPANY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={16} className={styles.chevron} />
              </label>
              <label className={styles.selectWrap}>
                <span className={styles.visuallyHidden}>กรองตามหมวดหมู่</span>
                <select className={styles.select} value={filters.categoryId} onChange={event => setCategory(event.target.value)}>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={16} className={styles.chevron} />
              </label>
            </div>
          </div>
          <div className={styles.panelDivider} />

          {items.length === 0 ? (
            <p className={styles.emptyState}>ไม่พบแอปพลิเคชันที่ตรงกับเงื่อนไข</p>
          ) : (
            <div ref={gridRef} className={`${styles.grid} ${isGridVisible ? styles.isVisible : ''}`}>
              {items.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  category={getAppCategory(app.categoryId)}
                  isFavorite={favoriteIds.has(app.id)}
                  onToggleFavorite={() => toggleFavorite(app.id)}
                />
              ))}
            </div>
          )}

          {canExpand && (
            <button type="button" className={styles.viewAllButton} onClick={toggleExpanded}>
              {isExpanded ? 'แสดงน้อยลง' : `ดูทั้งหมด (${filteredCount})`}
              <Icon name="chevronDown" size={16} className={isExpanded ? styles.chevronUp : ''} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
