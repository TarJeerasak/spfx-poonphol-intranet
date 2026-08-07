import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { estimateReadTimeMinutes } from '../../../../shared/utils/estimateReadTimeMinutes';
import { useAllNewsFeed } from '../../hooks/useAllNewsFeed';
import backChevronIcon from '../../assets/knowledge/icons/back-chevron.svg';
import styles from './NewsDetailPage.module.scss';

export function NewsDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { items, isLoading } = useAllNewsFeed();

  const item = items.find(candidate => candidate.id === id);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateMessage}>กำลังโหลด...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.page}>
        <p className={styles.stateMessage}>ไม่พบข่าวที่ต้องการ</p>
        <Link to="/news" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          กลับไปหน้าข่าวสาร
        </Link>
      </div>
    );
  }

  const readTimeMinutes = estimateReadTimeMinutes(item.excerpt);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/news" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          BACK
        </Link>

        <div className={styles.hero}>
          <div className={styles.heroImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
        </div>

        <div className={styles.metaRow}>
          {item.tag && <Tag label={item.tag} color={item.tagColor} />}
          {item.dateLabel && (
            <span className={styles.metaItem}>
              <Icon name="calendar" size={16} />
              {item.dateLabel}
            </span>
          )}
          <span className={styles.metaItem}>
            <Icon name="clock" size={16} />
            อ่านเมื่อ {readTimeMinutes} นาที
          </span>
        </div>

        <h1 className={styles.title}>{item.title}</h1>

        {item.excerpt && <p className={styles.detailsText}>{item.excerpt}</p>}
      </div>
    </div>
  );
}
