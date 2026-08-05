import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { KnowledgeItem } from '../../../../shared/types/content';
import { formatReadCountLabel } from '../../../../shared/utils/formatReadCountLabel';
import { KnowledgeLikeState } from '../../hooks/useKnowledgeLikes';
import styles from './KnowledgeCard.module.scss';

export interface KnowledgeCardProps {
  item: KnowledgeItem;
  likeState: KnowledgeLikeState;
  to: string;
  onToggleLike: () => void;
}

export function KnowledgeCard({ item, likeState, to, onToggleLike }: KnowledgeCardProps): React.ReactElement {
  const handleLikeClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    onToggleLike();
  };

  return (
    <Link to={to} className={styles.card}>
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
    </Link>
  );
}
