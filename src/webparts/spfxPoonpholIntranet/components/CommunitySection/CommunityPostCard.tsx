import * as React from 'react';
import { CommunityPost } from '../../../../shared/types/content';
import { shouldClampText } from '../../../../shared/utils/shouldClampText';
import likeIcon from '../../assets/home/icons/like.svg';
import styles from './CommunityPostCard.module.scss';

const MAX_VISIBLE_IMAGES = 4;

export interface CommunityPostCardProps {
  post: CommunityPost;
}

export function CommunityPostCard({ post }: CommunityPostCardProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isClampable = shouldClampText(post.text);
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
      <p className={`${styles.text} ${isClampable && !isExpanded ? styles.textClamped : ''}`}>{post.text}</p>
      {isClampable && (
        <button type="button" className={styles.toggleButton} onClick={() => setIsExpanded(current => !current)}>
          {isExpanded ? 'ย่อข้อความ' : 'ดูเพิ่มเติม'}
        </button>
      )}
      {visibleImages.length === 1 && <div className={styles.postImage} style={{ backgroundImage: `url(${visibleImages[0]})` }} />}
      {visibleImages.length > 1 && (
        <div className={styles.imageGrid}>
          {visibleImages.map((imageUrl, index) => (
            <div key={imageUrl} className={styles.imageGridTile} style={{ backgroundImage: `url(${imageUrl})` }}>
              {index === MAX_VISIBLE_IMAGES - 1 && overflowImageCount > 0 && (
                <span className={styles.imageGridOverlay}>+{overflowImageCount}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className={styles.actions}>
        <span className={styles.action}>
          <img src={likeIcon} alt="" width={16} height={16} />
          {post.likeCount}
        </span>
      </div>
    </div>
  );
}
