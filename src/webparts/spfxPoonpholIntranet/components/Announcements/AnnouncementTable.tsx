import * as React from 'react';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { Announcement } from '../../../../shared/types/content';
import { AnnouncementTableRow } from './AnnouncementTableRow';
import styles from './AnnouncementTable.module.scss';

export interface AnnouncementTableProps {
  items: Announcement[];
}

export function AnnouncementTable({ items }: AnnouncementTableProps): React.ReactElement {
  const [tableRef, isVisible] = useScrollReveal<HTMLDivElement>();

  if (items.length === 0) {
    return <div className={styles.empty}>ไม่พบประกาศที่ตรงกับเงื่อนไขที่เลือก</div>;
  }

  return (
    <div ref={tableRef} className={styles.table}>
      <div className={styles.headerRow}>
        <div className={styles.cellTitle}>หัวข้อประกาศ</div>
        <div className={styles.cellType}>ประเภท</div>
        <div className={styles.cellDate}>วันที่ประกาศ</div>
      </div>
      <div className={styles.body}>
        {items.map((item, index) => (
          <AnnouncementTableRow key={item.id} item={item} isVisible={isVisible} revealDelay={index * 35} />
        ))}
      </div>
    </div>
  );
}
