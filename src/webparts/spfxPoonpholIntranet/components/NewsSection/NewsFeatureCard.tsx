import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { NewsItem } from '../../../../shared/types/content';
import styles from './NewsFeatureCard.module.scss';

export interface NewsFeatureCardProps {
  item: NewsItem;
}

export function NewsFeatureCard({ item }: NewsFeatureCardProps): React.ReactElement {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${item.imageUrl})` }}>
      <div className={styles.content}>
        <Tag label={item.tag} color={item.tagColor} />
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.excerpt}>{item.excerpt}</p>
        <div className={styles.meta}>
          {item.dateLabel && (
            <span className={styles.metaItem}>
              <Icon name="calendar" size={16} />
              {item.dateLabel}
            </span>
          )}
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
    </div>
  );
}
