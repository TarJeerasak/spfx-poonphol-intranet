import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { EventItem } from '../../../../shared/types/content';
import styles from './EventFeatureCard.module.scss';

export interface EventFeatureCardProps {
  item: EventItem;
}

export function EventFeatureCard({ item }: EventFeatureCardProps): React.ReactElement {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${item.imageUrl})` }}>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Icon name="calendar" size={14} />
            {item.dateDay} {item.dateMonthLabel}
          </span>
          {item.timeLabel && (
            <span className={styles.metaItem}>
              <Icon name="clock" size={14} />
              {item.timeLabel}
            </span>
          )}
          {item.locationLabel && (
            <span className={styles.metaItem}>
              <Icon name="location" size={14} />
              {item.locationLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
