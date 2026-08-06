import * as React from 'react';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { GalleryItem } from '../../../../shared/types/content';
import styles from './GalleryCard.module.scss';

export interface GalleryCardProps {
  item: GalleryItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function GalleryCard({ item, isSelected, onSelect }: GalleryCardProps): React.ReactElement {
  return (
    <button
      type="button"
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <div className={styles.thumbnail} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      <div className={styles.body}>
        <Tag label={item.categoryLabel} color={item.categoryColor} textColor={item.categoryTextColor} borderColor={item.categoryBorderColor} />
        <p className={styles.title} title={item.title}>{item.title}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Icon name="calendar" size={16} />
            {item.dateLabel}
          </span>
          <span className={styles.metaItem}>
            <Icon name="image" size={16} />
            {item.photoCount}
          </span>
        </div>
      </div>
    </button>
  );
}
