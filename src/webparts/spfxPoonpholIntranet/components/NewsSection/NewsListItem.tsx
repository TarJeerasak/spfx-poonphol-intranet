import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { NewsItem } from '../../../../shared/types/content';
import authorAvatarImg from '../../assets/home/ellipse-avatar-small.png';
import styles from './NewsListItem.module.scss';

export interface NewsListItemProps {
  item: NewsItem;
}

export function NewsListItem({ item }: NewsListItemProps): React.ReactElement {
  return (
    <div className={styles.row}>
      <div className={styles.thumbnail} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      <div className={styles.body}>
        <div className={styles.headerGroup}>
          <Tag label={item.tag} color={item.tagColor} />
          <p className={styles.title}>{item.title}</p>
        </div>
        <div className={styles.meta}>
          <img src={item.authorAvatarUrl || authorAvatarImg} alt="" width={18} height={18} className={styles.avatar} />
          {item.authorName && <span>{item.authorName}</span>}
          <span className={styles.metaDivider} />
          <span>{item.dateLabel}</span>
          {item.timeLabel && (
            <>
              <span className={styles.metaDivider} />
              <span className={styles.metaItem}>
                <Icon name="clock" size={14} />
                {item.timeLabel}
              </span>
            </>
          )}
        </div>
        <p className={styles.excerpt}>{item.excerpt}</p>
      </div>
    </div>
  );
}
