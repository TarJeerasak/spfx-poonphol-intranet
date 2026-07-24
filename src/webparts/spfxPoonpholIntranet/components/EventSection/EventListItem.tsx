import * as React from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { EventItem } from '../../../../shared/types/content';
import styles from './EventListItem.module.scss';

export interface EventListItemProps {
  item: EventItem;
}

export function EventListItem({ item }: EventListItemProps): React.ReactElement {
  return (
    <div className={styles.row}>
      <div className={styles.dateBadge}>
        <span className={styles.day}>{item.dateDay}</span>
        <span className={styles.month}>{item.dateMonthLabel}</span>
      </div>
      <div className={styles.thumbnail} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      <div className={styles.body}>
        <p className={styles.title}>{item.title}</p>
        <div className={styles.meta}>
          <span>{item.timeLabel}</span>
          <span className={styles.metaDivider} />
          <span>{item.locationLabel}</span>
        </div>
        <div className={styles.footer}>
          <div className={styles.avatarGroup}>
            {item.attendeeAvatarUrls.map((url, index) => (
              <img key={index} src={url} alt="" className={styles.avatar} style={{ zIndex: item.attendeeAvatarUrls.length - index }} />
            ))}
            {item.overflowCount > 0 ? <span className={styles.overflow}>+{item.overflowCount}</span> : null}
          </div>
          <Button variant="outline">เข้าร่วม</Button>
        </div>
      </div>
    </div>
  );
}
