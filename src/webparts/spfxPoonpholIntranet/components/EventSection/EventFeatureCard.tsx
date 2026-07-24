import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import styles from './EventFeatureCard.module.scss';

export interface EventFeatureCardProps {
  title: string;
  subtitle: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  imageUrl: string;
}

export function EventFeatureCard({
  title,
  subtitle,
  dateLabel,
  timeLabel,
  locationLabel,
  imageUrl
}: EventFeatureCardProps): React.ReactElement {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Icon name="calendar" size={14} />
            {dateLabel}
          </span>
          <span className={styles.metaItem}>
            <Icon name="clock" size={14} />
            {timeLabel}
          </span>
          <span className={styles.metaItem}>
            <Icon name="location" size={14} />
            {locationLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
