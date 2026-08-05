import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import styles from './SectionFooter.module.scss';

export interface SectionFooterProps {
  shownCount?: number;
  totalCount?: number;
  viewAllTo?: string;
  viewAllHref?: string;
}

export function SectionFooter({ shownCount, totalCount, viewAllTo, viewAllHref = '#' }: SectionFooterProps): React.ReactElement {
  const label = (
    <>
      ดูทั้งหมด
      <Icon name="arrowRight" size={16} />
    </>
  );

  return (
    <div className={styles.footer}>
      {shownCount !== undefined && totalCount !== undefined ? (
        <p className={styles.countText}>
          แสดง {shownCount} จาก {totalCount} รายการ
        </p>
      ) : (
        <span />
      )}
      {viewAllTo ? (
        <Link to={viewAllTo} className={styles.viewAll}>
          {label}
        </Link>
      ) : (
        <a href={viewAllHref} className={styles.viewAll}>
          {label}
        </a>
      )}
    </div>
  );
}
