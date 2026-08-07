import * as React from 'react';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  activeVariant?: 'gold' | 'accent';
}

function buildPageNumbers(page: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const sorted = Array.from(pages)
    .filter(value => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const result: Array<number | 'ellipsis'> = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(value);
  });

  return result;
}

export function Pagination({ page, pageCount, onPageChange, activeVariant = 'gold' }: PaginationProps): React.ReactElement {
  const pageNumbers = buildPageNumbers(page, pageCount);
  const activeClassName = activeVariant === 'accent' ? styles.pageButtonActiveAccent : styles.pageButtonActive;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.arrowButton}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="หน้าก่อนหน้า"
      >
        &lt;
      </button>
      {pageNumbers.map((value, index) =>
        value === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={value}
            type="button"
            className={`${styles.pageButton} ${value === page ? activeClassName : ''}`}
            onClick={() => onPageChange(value)}
          >
            {value}
          </button>
        )
      )}
      <button
        type="button"
        className={styles.arrowButton}
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="หน้าถัดไป"
      >
        &gt;
      </button>
    </div>
  );
}
