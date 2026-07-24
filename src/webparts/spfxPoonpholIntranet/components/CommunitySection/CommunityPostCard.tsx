import * as React from 'react';
import { CommunityPost } from '../../../../shared/types/content';
import likeIcon from '../../assets/home/icons/like.svg';
import styles from './CommunityPostCard.module.scss';

export interface CommunityPostCardProps {
  post: CommunityPost;
}

export function CommunityPostCard({ post }: CommunityPostCardProps): React.ReactElement {
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
          <p className={styles.role}>{post.authorRole}</p>
        </div>
      </div>
      <p className={styles.text}>{post.text}</p>
      {post.imageUrl ? <div className={styles.postImage} style={{ backgroundImage: `url(${post.imageUrl})` }} /> : null}
      <div className={styles.actions}>
        <span className={styles.action}>
          <img src={likeIcon} alt="" width={16} height={16} />
          {post.likeCount}
        </span>
      </div>
    </div>
  );
}
