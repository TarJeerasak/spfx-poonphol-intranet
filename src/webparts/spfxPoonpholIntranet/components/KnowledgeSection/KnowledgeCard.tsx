import * as React from 'react';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { KnowledgeItem } from '../../../../shared/types/content';
import styles from './KnowledgeCard.module.scss';

export interface KnowledgeCardProps {
  item: KnowledgeItem;
}

export function KnowledgeCard({ item }: KnowledgeCardProps): React.ReactElement {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      <div className={styles.body}>
        <Tag label={item.tag} color="#41a9e5" />
        <div className={styles.textGroup}>
          <p className={styles.title}>{item.title}</p>
          <p className={styles.progressLabel}>{item.progressLabel}</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${item.progressPercent}%` }} />
          </div>
          <p className={styles.location}>{item.locationLabel}</p>
        </div>
      </div>
    </div>
  );
}
