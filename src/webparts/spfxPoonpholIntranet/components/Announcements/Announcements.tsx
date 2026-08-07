import * as React from 'react';
import { Link } from 'react-router-dom';
import { Announcement } from '../../../../shared/types/content';
import headerIcon from '../../assets/home/icons/announcements-header.svg';
import clockIcon from '../../assets/home/icons/announcement-clock.svg';
import viewAllArrowIcon from '../../assets/home/icons/view-all-arrow.svg';
import styles from './Announcements.module.scss';

const MAX_VISIBLE_ANNOUNCEMENTS = 3;

export interface AnnouncementsProps {
  items: Announcement[];
}

export function Announcements({ items }: AnnouncementsProps): React.ReactElement {
  const visibleItems = items.slice(0, MAX_VISIBLE_ANNOUNCEMENTS);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Announcements</h3>
        <img src={headerIcon} alt="" width={20} height={20} />
      </div>
      <div className={styles.list}>
        {visibleItems.map(item => (
          <Link key={item.id} to={`/announcements/${item.id}`} className={styles.item}>
            <span className={styles.dot} />
            <div className={styles.itemBody}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemDescription}>{item.description}</p>
              <div className={styles.itemMeta}>
                <img src={clockIcon} alt="" width={12} height={12} />
                <span>{item.dateTimeLabel}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/announcements" className={styles.viewAll}>
        View All Announcements
        <img src={viewAllArrowIcon} alt="" width={16} height={16} />
      </Link>
    </div>
  );
}
