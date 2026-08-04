import * as React from 'react';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { KnowledgeItem } from '../../../../shared/types/content';
import { formatReadCountLabel } from '../../../../shared/utils/formatReadCountLabel';
import styles from './KnowledgeCard.module.scss';

export interface KnowledgeCardProps {
  item: KnowledgeItem;
  onRead: () => void;
}

export function KnowledgeCard({ item, onRead }: KnowledgeCardProps): React.ReactElement {
  return (
    <button type="button" className={styles.card} onClick={onRead}>
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      </div>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.tagGroup}>
            {item.tags.map(tag => (
              <Tag key={tag} label={tag} color="#41a9e5" />
            ))}
          </div>
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
