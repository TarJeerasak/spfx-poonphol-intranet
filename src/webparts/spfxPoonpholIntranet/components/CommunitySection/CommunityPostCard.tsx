import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Lightbox } from '../../../../shared/components/Lightbox/Lightbox';
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
  canManage: boolean;
  onToggleLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CommunityPostCard({ post, likeState, canManage, onToggleLike, onEdit, onDelete }: CommunityPostCardProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const hasImages = post.imageUrls.length > 0;
  const isClampable = shouldClampText(
    post.text,
    hasImages ? CLAMP_TEXT_THRESHOLD_WITH_IMAGES : CLAMP_TEXT_THRESHOLD_WITHOUT_IMAGES
  );
  const visibleImages = post.imageUrls.slice(0, MAX_VISIBLE_IMAGES);
  const overflowImageCount = post.imageUrls.length - MAX_VISIBLE_IMAGES;

  React.useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

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
        {canManage && (
          <div ref={menuRef} className={styles.optionsMenu}>
            <button
              type="button"
              className={styles.optionsTrigger}
              onClick={() => setIsMenuOpen(current => !current)}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-label="ตัวเลือกโพสต์"
            >
              <Icon name="moreHorizontal" size={18} />
            </button>
            {isMenuOpen && (
              <ul className={styles.optionsList} role="menu">
                <li>
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.optionsItem}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit();
                    }}
                  >
                    <Icon name="edit" size={16} />
                    แก้ไขโพสต์
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    role="menuitem"
                    className={`${styles.optionsItem} ${styles.optionsItemDanger}`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                  >
                    <Icon name="trash" size={16} />
                    ลบโพสต์
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
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
        <div className={styles.postImage} onClick={() => setLightboxIndex(0)}>
          <div className={styles.imageZoom} style={{ backgroundImage: `url(${visibleImages[0]})` }} />
        </div>
      )}
      {visibleImages.length > 1 && (
        <div className={`${styles.imageGrid} ${visibleImages.length === 3 ? styles.imageGridThree : ''}`}>
          {visibleImages.map((imageUrl, index) => (
            <div key={imageUrl} className={styles.imageGridTile} onClick={() => setLightboxIndex(index)}>
              <div className={styles.imageZoom} style={{ backgroundImage: `url(${imageUrl})` }} />
              {index === MAX_VISIBLE_IMAGES - 1 && overflowImageCount > 0 && (
                <span className={styles.imageGridOverlay}>+{overflowImageCount}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {lightboxIndex !== undefined && (
        <Lightbox images={post.imageUrls} startIndex={lightboxIndex} onClose={() => setLightboxIndex(undefined)} />
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
