import * as React from 'react';
import { Dropdown } from '../../../../shared/components/Dropdown/Dropdown';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import { AnnouncementSortOrder, ALL_ANNOUNCEMENT_TYPE_VALUE } from '../../services/announcementService';
import { useAnnouncementListFeed } from '../../hooks/useAnnouncementListFeed';
import bannerImageUrl from '../../assets/announcements/hero-banner.png';
import { AnnouncementTable } from './AnnouncementTable';
import styles from './AnnouncementsPage.module.scss';

const SORT_OPTIONS: { value: AnnouncementSortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest update' },
  { value: 'oldest', label: 'Oldest update' }
];

export function AnnouncementsPage(): React.ReactElement {
  const { items, typeOptions, filters, sortOrder, page, pageCount, filteredCount, isLoading, setSearch, setType, setSortOrder, setPage } =
    useAnnouncementListFeed();

  const [searchDraft, setSearchDraft] = React.useState(filters.search);

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
      <section className={styles.banner}>
        <div className={styles.bannerImageWrap}>
          <img src={bannerImageUrl} alt="" className={styles.bannerImage} />
        </div>
        <div className={styles.bannerFade} />
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Announcements</h1>
          <p className={styles.bannerSubtitle}>ประกาศและแจ้งเตือนจากองค์กร</p>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.typeTabs}>
              <button
                type="button"
                className={`${styles.typeTab} ${filters.type === ALL_ANNOUNCEMENT_TYPE_VALUE ? styles.typeTabActive : ''}`}
                onClick={() => setType(ALL_ANNOUNCEMENT_TYPE_VALUE)}
                aria-pressed={filters.type === ALL_ANNOUNCEMENT_TYPE_VALUE}
              >
                ดูทั้งหมด
              </button>
              {typeOptions.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeTab} ${filters.type === type ? styles.typeTabActive : ''}`}
                  onClick={() => setType(type)}
                  aria-pressed={filters.type === type}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className={styles.sortControl}>
              <span className={styles.sortLabel}>Sort by:</span>
              <Dropdown label="เรียงลำดับ" value={sortOrder} options={SORT_OPTIONS} onChange={value => setSortOrder(value as AnnouncementSortOrder)} />
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
                  aria-label="ค้นหาประกาศ"
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

          <div className={styles.panelDivider} />

          {isLoading ? <p className={styles.stateMessage}>กำลังโหลด...</p> : <AnnouncementTable items={items} />}

          <div className={styles.panelFooter}>
            <p className={styles.footerSummary}>
              แสดง {items.length} จาก {filteredCount} รายการ
            </p>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </section>
      </div>
    </div>
  );
}
