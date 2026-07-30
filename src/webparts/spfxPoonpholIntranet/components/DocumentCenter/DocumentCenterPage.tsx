import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { useDocumentCenterFeed } from '../../hooks/useDocumentCenterFeed';
import { DOCUMENT_COMPANIES, DOCUMENT_DEPARTMENTS, DOCUMENT_TYPES } from '../../services/documentCenterService';
import bannerImageUrl from '../../assets/document-center/hero-banner.jpg';
import { CategoryCard } from './CategoryCard';
import { DocumentTable } from './DocumentTable';
import { FilterOption, FilterSidebar } from './FilterSidebar';
import { Pagination } from './Pagination';
import { RecentDocuments } from './RecentDocuments';
import styles from './DocumentCenterPage.module.scss';

const ALL_OPTION: FilterOption = { value: 'All', label: 'ทั้งหมด' };
const COMPANY_OPTIONS: FilterOption[] = [ALL_OPTION, ...DOCUMENT_COMPANIES.map(value => ({ value, label: value }))];
const DEPARTMENT_OPTIONS: FilterOption[] = [ALL_OPTION, ...DOCUMENT_DEPARTMENTS.map(value => ({ value, label: value }))];
const TYPE_OPTIONS: FilterOption[] = [ALL_OPTION, ...DOCUMENT_TYPES.map(value => ({ value, label: value }))];

export function DocumentCenterPage(): React.ReactElement {
  const {
    categorySummaries,
    recentDocuments,
    items,
    filters,
    sortOrder,
    page,
    pageCount,
    filteredCount,
    setSearch,
    setCompany,
    setDepartment,
    setType,
    setSortOrder,
    setPage,
    clearFilters
  } = useDocumentCenterFeed();

  const [searchDraft, setSearchDraft] = React.useState(filters.search);

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setSearch(searchDraft);
  };

  return (
    <div className={styles.page}>
      <section className={styles.banner} style={{ backgroundImage: `url(${bannerImageUrl})` }}>
        <div className={styles.bannerFade} />
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Document Center</h1>
          <p className={styles.bannerSubtitle}>ค้นหาเอกสารของกลุ่มพูลผล</p>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.categoryRow}>
          {categorySummaries.map(summary => (
            <CategoryCard
              key={summary.id}
              summary={summary}
              isActive={filters.type === summary.type}
              onSelect={() => setType(filters.type === summary.type ? 'All' : summary.type)}
            />
          ))}
        </div>

        <div className={styles.contentRow}>
          <div className={styles.sidebarColumn}>
            <FilterSidebar
              company={filters.company}
              department={filters.department}
              type={filters.type}
              companyOptions={COMPANY_OPTIONS}
              departmentOptions={DEPARTMENT_OPTIONS}
              typeOptions={TYPE_OPTIONS}
              onCompanyChange={setCompany}
              onDepartmentChange={setDepartment}
              onTypeChange={setType}
              onClearAll={() => {
                setSearchDraft('');
                clearFilters();
              }}
            />
            <RecentDocuments documents={recentDocuments} />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>เอกสาร ({filteredCount})</p>
              <div className={styles.panelControls}>
                <label className={styles.sortLabel} htmlFor="document-sort">
                  Sort by:
                </label>
                <select
                  id="document-sort"
                  className={styles.sortSelect}
                  value={sortOrder}
                  onChange={event => setSortOrder(event.target.value as 'latest' | 'oldest')}
                >
                  <option value="latest">Latest update</option>
                  <option value="oldest">Oldest update</option>
                </select>
                <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
                  <span className={styles.searchIcon}>
                    <Icon name="search" size={18} />
                  </span>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="search"
                    value={searchDraft}
                    onChange={event => setSearchDraft(event.target.value)}
                    aria-label="ค้นหาเอกสาร"
                  />
                  <button type="submit" className={styles.searchButton}>
                    Search
                  </button>
                </form>
              </div>
            </div>
            <div className={styles.panelDivider} />
            <DocumentTable documents={items} />
            <div className={styles.panelFooter}>
              <p className={styles.footerSummary}>
                แสดง {items.length} จาก {filteredCount} รายการ
              </p>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
