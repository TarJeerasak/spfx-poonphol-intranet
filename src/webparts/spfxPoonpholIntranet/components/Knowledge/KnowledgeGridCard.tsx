import * as React from 'react';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { KnowledgeItem } from '../../../../shared/types/content';
import { formatReadCountLabel } from '../../../../shared/utils/formatReadCountLabel';
import { KnowledgeLikeState } from '../../hooks/useKnowledgeLikes';
import styles from './KnowledgeGridCard.module.scss';

export interface KnowledgeGridCardProps {
  item: KnowledgeItem;
  likeState: KnowledgeLikeState;
  onRead: () => void;
  onToggleLike: () => void;
}

export function KnowledgeGridCard({ item, likeState, onRead, onToggleLike }: KnowledgeGridCardProps): React.ReactElement {
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRead();
    }
  };

  const handleLikeClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    onToggleLike();
  };

  return (
    <div className={styles.card} role="button" tabIndex={0} onClick={onRead} onKeyDown={handleKeyDown}>
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      </div>
      <div className={styles.body}>
        <div className={styles.topRow}>
          {item.tags[0] && <Tag label={item.tags[0]} color="#cadfff" textColor="#062b62" borderColor="#062b62" />}
          <button
            type="button"
            className={`${styles.likeButton} ${likeState.isLiked ? styles.likeButtonActive : ''}`}
            onClick={handleLikeClick}
            disabled={likeState.isSaving}
            aria-pressed={likeState.isLiked}
            aria-label={likeState.isLiked ? `นำ ${item.title} ออกจากรายการที่ถูกใจ` : `เพิ่ม ${item.title} เป็นรายการที่ถูกใจ`}
          >
            <Icon name="heart" size={20} />
          </button>
        </div>
        <div className={styles.textGroup}>
          <p className={styles.title}>{item.title}</p>
          <p className={styles.readCountLabel}>{formatReadCountLabel(item.readCount)}</p>
        </div>
      </div>
    </div>
  );
}
