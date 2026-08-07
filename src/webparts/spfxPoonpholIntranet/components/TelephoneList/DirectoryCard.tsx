import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import styles from './DirectoryCard.module.scss';

export function DirectoryCellText({ children }: { children: React.ReactNode }): React.ReactElement {
  return <p className={styles.cellPrimary}>{children}</p>;
}

export function DirectoryCellTwoLine({ primary, secondary }: { primary: React.ReactNode; secondary?: React.ReactNode }): React.ReactElement {
  return (
    <>
      <p className={styles.cellPrimary}>{primary}</p>
      {secondary && <p className={styles.cellSecondary}>{secondary}</p>}
    </>
  );
}

export function DirectoryCellWrapText({ children }: { children: React.ReactNode }): React.ReactElement {
  return <p className={styles.cellWrapText}>{children}</p>;
}

export interface DirectoryColumn<T> {
  key: string;
  header: string;
  wrap?: boolean;
  render: (row: T) => React.ReactNode;
}

export interface DirectoryCardProps<T> {
  title: string;
  toolbar: React.ReactNode;
  searchPlaceholder: string;
  searchAriaLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchClear: () => void;
  onExport: () => void;
  gridTemplateColumns: string;
  columns: Array<DirectoryColumn<T>>;
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
  page: number;
  pageCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function DirectoryCard<T>({
  title,
  toolbar,
  searchPlaceholder,
  searchAriaLabel,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onExport,
  gridTemplateColumns,
  columns,
  rows,
  getRowKey,
  emptyMessage,
  page,
  pageCount,
  totalCount,
  onPageChange
}: DirectoryCardProps<T>): React.ReactElement {
  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        <div className={styles.filters}>
          {toolbar}
          <button type="button" className={styles.exportButton} onClick={onExport}>
            <Icon name="download" size={16} />
            Export
          </button>
        </div>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <span className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <Icon name="search" size={18} />
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={event => onSearchChange(event.target.value)}
              aria-label={searchAriaLabel}
            />
            {searchValue.length > 0 && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={onSearchClear}
                aria-label="ล้างคำค้นหา"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </span>
          <button type="submit" className={styles.searchButton}>
            ค้นหา
          </button>
        </form>
      </div>

      <div className={styles.divider} />

      {rows.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow} style={{ gridTemplateColumns }}>
            {columns.map(column => (
              <div key={column.key} className={styles.headerCell}>
                {column.header}
              </div>
            ))}
          </div>
          <div className={styles.body} style={{ gridTemplateColumns }}>
            {rows.map(row =>
              columns.map(column => (
                <div key={`${getRowKey(row)}-${column.key}`} className={`${styles.bodyCell} ${column.wrap ? styles.bodyCellWrap : ''}`}>
                  {column.render(row)}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.footer}>
        <p className={styles.summary}>
          แสดง {rows.length} จาก {totalCount} รายการ
        </p>
        <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} activeVariant="gold" />
      </div>
    </div>
  );
}
