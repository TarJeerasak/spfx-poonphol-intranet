import * as React from 'react';
import { Icon } from '../Icon/Icon';
import styles from './SectionFooter.module.scss';

export interface SectionFooterProps {
  shownCount?: number;
  totalCount?: number;
  viewAllHref?: string;
}

export function SectionFooter({ shownCount, totalCount, viewAllHref = '#' }: SectionFooterProps): React.ReactElement {
  return (
    <div className={styles.footer}>
      {shownCount !== undefined && totalCount !== undefined ? (
        <p className={styles.countText}>
          แสดง {shownCount} จาก {totalCount} รายการ
        </p>
      ) : (
        <span />
      )}
      <a href={viewAllHref} className={styles.viewAll}>
        ดูทั้งหมด
        <Icon name="arrowRight" size={16} />
      </a>
    </div>
  );
}
