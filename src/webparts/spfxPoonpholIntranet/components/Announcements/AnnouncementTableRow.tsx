import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { Announcement } from '../../../../shared/types/content';
import styles from './AnnouncementTable.module.scss';

export interface AnnouncementTableRowProps {
  item: Announcement;
  isVisible: boolean;
  revealDelay: number;
}

export function AnnouncementTableRow({ item, isVisible, revealDelay }: AnnouncementTableRowProps): React.ReactElement {
  return (
    <Link
      to={`/announcements/${item.id}`}
      className={`${styles.row} ${isVisible ? styles.isVisible : ''}`}
      style={{ transitionDelay: isVisible ? `${revealDelay}ms` : '0ms' }}
    >
      <div className={styles.cellTitle}>
        <p className={styles.title}>{item.title}</p>
        {item.description && <p className={styles.excerpt}>{item.description}</p>}
      </div>
      <div className={styles.cellType}>
        {item.typeLabel && (
          <Tag label={item.typeLabel} color={item.typeColor} textColor={item.typeTextColor} borderColor={item.typeBorderColor} />
        )}
      </div>
      <div className={styles.cellDate}>{item.dateLabel}</div>
    </Link>
  );
}
