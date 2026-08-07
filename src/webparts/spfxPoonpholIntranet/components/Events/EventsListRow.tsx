import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { ImageFallback } from '../../../../shared/components/ImageFallback/ImageFallback';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { EventItem } from '../../../../shared/types/content';
import styles from './EventsListRow.module.scss';

export interface EventsListRowProps {
  item: EventItem;
}

export function EventsListRow({ item }: EventsListRowProps): React.ReactElement {
  return (
    <div className={styles.row}>
      <div className={styles.dateBadge}>
        <span className={styles.day}>{item.dateDay}</span>
        <span className={styles.month}>{item.dateMonthLabel}</span>
      </div>
      <ImageFallback imageUrl={item.imageUrl} className={styles.thumbnail} />
      <div className={styles.body}>
        {item.categoryLabel && (
          <Tag
            label={item.categoryLabel}
            color={item.categoryColor}
            textColor={item.categoryTextColor}
            borderColor={item.categoryBorderColor}
          />
        )}
        <div className={styles.textBlock}>
          <p className={styles.title}>{item.title}</p>
          {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
        </div>
        <div className={styles.meta}>
          {item.timeLabel && (
            <span className={styles.metaItem}>
              <Icon name="clock" size={16} />
              {item.timeLabel}
            </span>
          )}
          {item.locationLabel && (
            <span className={styles.metaItem}>
              <Icon name="location" size={16} />
              {item.locationLabel}
            </span>
          )}
        </div>
      </div>
      <Link to={`/events/${item.id}`} className={styles.detailButton}>
        รายละเอียดเพิ่มเติม
      </Link>
    </div>
  );
}
