import * as React from 'react';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { KnowledgeItem } from '../../../../shared/types/content';
import { formatReadCountLabel } from '../../../../shared/utils/formatReadCountLabel';
import styles from './KnowledgeGridCard.module.scss';

export interface KnowledgeGridCardProps {
  item: KnowledgeItem;
  onRead: () => void;
}

export function KnowledgeGridCard({ item, onRead }: KnowledgeGridCardProps): React.ReactElement {
  return (
    <button type="button" className={styles.card} onClick={onRead}>
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      </div>
      <div className={styles.body}>
        <div className={styles.topRow}>
          {item.tags[0] && <Tag label={item.tags[0]} color="#cadfff" textColor="#062b62" borderColor="#062b62" />}
          <Icon name="heart" size={20} className={styles.heartIcon} />
        </div>
        <div className={styles.textGroup}>
          <p className={styles.title}>{item.title}</p>
          <p className={styles.readCountLabel}>{formatReadCountLabel(item.readCount)}</p>
        </div>
      </div>
    </button>
  );
}
