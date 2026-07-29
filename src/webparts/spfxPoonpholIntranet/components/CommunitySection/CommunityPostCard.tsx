import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { CommunityPost } from '../../../../shared/types/content';
import {
  shouldClampText,
  CLAMP_TEXT_THRESHOLD_WITH_IMAGES,
  CLAMP_TEXT_THRESHOLD_WITHOUT_IMAGES,
} from '../../../../shared/utils/shouldClampText';
import { CommunityLikeState } from '../../hooks/useCommunityLikes';
import styles from './CommunityPostCard.module.scss';

const MAX_VISIBLE_IMAGES = 4;

export interface CommunityPostCardProps {
  post: CommunityPost;
  likeState: CommunityLikeState;
  onToggleLike: () => void;
}

export function CommunityPostCard({ post, likeState, onToggleLike }: CommunityPostCardProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasImages = post.imageUrls.length > 0;
  const isClampable = shouldClampText(
    post.text,
    hasImages ? CLAMP_TEXT_THRESHOLD_WITH_IMAGES : CLAMP_TEXT_THRESHOLD_WITHOUT_IMAGES
  );
  const visibleImages = post.imageUrls.slice(0, MAX_VISIBLE_IMAGES);
  const overflowImageCount = post.imageUrls.length - MAX_VISIBLE_IMAGES;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={post.authorAvatarUrl} alt="" className={styles.avatar} />
        <div className={styles.headerText}>
          <div className={styles.nameRow}>
            <span className={styles.authorName}>{post.authorName}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.postedAt}>{post.postedAtLabel}</span>
          </div>
          {post.authorRole && <p className={styles.role}>{post.authorRole}</p>}
        </div>
      </div>
      <p
        className={`${styles.text} ${
          isClampable && !isExpanded ? (hasImages ? styles.textClampedWithImages : styles.textClampedWithoutImages) : ''
        }`}
      >
        {post.text}
      </p>
      {isClampable && (
        <button type="button" className={styles.toggleButton} onClick={() => setIsExpanded(current => !current)}>
          {isExpanded ? 'ย่อข้อความ' : 'ดูเพิ่มเติม'}
        </button>
      )}
      {visibleImages.length === 1 && (
        <div className={styles.postImage}>
          <div className={styles.imageZoom} style={{ backgroundImage: `url(${visibleImages[0]})` }} />
        </div>
      )}
      {visibleImages.length > 1 && (
        <div className={`${styles.imageGrid} ${visibleImages.length === 3 ? styles.imageGridThree : ''}`}>
          {visibleImages.map((imageUrl, index) => (
            <div key={imageUrl} className={styles.imageGridTile}>
              <div className={styles.imageZoom} style={{ backgroundImage: `url(${imageUrl})` }} />
              {index === MAX_VISIBLE_IMAGES - 1 && overflowImageCount > 0 && (
                <span className={styles.imageGridOverlay}>+{overflowImageCount}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${likeState.isLiked ? styles.liked : ''}`}
          onClick={onToggleLike}
          disabled={likeState.isSaving}
          aria-pressed={likeState.isLiked}
        >
          <Icon name="like" size={16} />
          {likeState.likeCount}
        </button>
      </div>
    </div>
  );
}
