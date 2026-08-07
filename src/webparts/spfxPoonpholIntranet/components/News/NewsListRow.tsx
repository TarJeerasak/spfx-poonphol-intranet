import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { NewsItem } from '../../../../shared/types/content';
import styles from './NewsListRow.module.scss';

export interface NewsListRowProps {
  item: NewsItem;
}

export function NewsListRow({ item }: NewsListRowProps): React.ReactElement {
  return (
    <div className={styles.row}>
      <div className={styles.thumbnail} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      <div className={styles.body}>
        {item.tag && <Tag label={item.tag} color={item.tagColor} />}
        <div className={styles.textBlock}>
          <p className={styles.title}>{item.title}</p>
          {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}
        </div>
        <div className={styles.meta}>
          {item.dateLabel && (
            <span className={styles.metaItem}>
              <Icon name="calendar" size={16} />
              {item.dateLabel}
            </span>
          )}
        </div>
      </div>
      <Link to={`/news/${item.id}`} className={styles.detailButton}>
        อ่านเพิ่มเติม
      </Link>
    </div>
  );
}
