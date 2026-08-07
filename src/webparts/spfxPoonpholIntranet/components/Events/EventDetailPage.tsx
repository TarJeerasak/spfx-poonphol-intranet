import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { ImageFallback } from '../../../../shared/components/ImageFallback/ImageFallback';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { formatThaiDateShort } from '../../../../shared/utils/formatThaiDateShort';
import { useAllEventsFeed } from '../../hooks/useAllEventsFeed';
import backChevronIcon from '../../assets/knowledge/icons/back-chevron.svg';
import styles from './EventDetailPage.module.scss';

export function EventDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { items, isLoading } = useAllEventsFeed();

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
        <p className={styles.stateMessage}>ไม่พบกิจกรรมที่ต้องการ</p>
        <Link to="/events" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          กลับไปหน้ากิจกรรม
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/events" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          BACK
        </Link>

        <div className={styles.headerBlock}>
          <Tag label={item.categoryLabel} color={item.categoryColor} textColor={item.categoryTextColor} borderColor={item.categoryBorderColor} />
          <h1 className={styles.title}>{item.title}</h1>
        </div>

        <div className={styles.metaRow}>
          {item.dateFromIso && (
            <span className={styles.metaItem}>
              <Icon name="calendar" size={16} />
              {formatThaiDateShort(new Date(item.dateFromIso))}
            </span>
          )}
          {item.timeLabel && (
            <span className={styles.metaItem}>
              <Icon name="clock" size={16} />
              {item.timeLabel}
            </span>
          )}
          {item.locationLabel && (
            <span className={styles.metaItem}>
              <Icon name="location" size={16} />
              {item.locationLabel}
            </span>
          )}
        </div>

        <div className={styles.hero}>
          <ImageFallback imageUrl={item.imageUrl} className={styles.heroImage} />
        </div>

        {item.subtitle && (
          <div className={styles.detailsSection}>
            <p className={styles.detailsTitle}>รายละเอียด</p>
            <p className={styles.detailsText}>{item.subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
