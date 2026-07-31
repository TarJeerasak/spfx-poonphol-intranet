import * as React from 'react';
import { AppCategory, AppItem } from '../../../../shared/types/content';
import starFilledIcon from '../../assets/more-apps/icons/star-filled.svg';
import starOutlineIcon from '../../assets/more-apps/icons/star-outline.svg';
import { getCategoryIcon } from './getCategoryIcon';
import styles from './AppListRow.module.scss';

export interface AppListRowProps {
  app: AppItem;
  category: AppCategory;
  isFavorite: boolean;
  isVisible: boolean;
  revealDelay: number;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

export function AppListRow({ app, category, isFavorite, isVisible, revealDelay, onToggleFavorite, onOpen }: AppListRowProps): React.ReactElement {
  const iconUrl = getCategoryIcon(app.categoryId);

  const handleFavoriteClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite();
  };

  return (
    <a
      href={app.launchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.row} ${isVisible ? styles.isVisible : ''}`}
      style={{ transitionDelay: isVisible ? `${revealDelay}ms` : '0ms' }}
      title={app.name}
      onClick={onOpen}
    >
      <div className={styles.iconTile} style={{ backgroundColor: category.backgroundColor }}>
        <span
          className={styles.iconGlyph}
          style={{ backgroundColor: category.textColor, maskImage: `url(${iconUrl})`, WebkitMaskImage: `url(${iconUrl})` }}
          aria-hidden="true"
        />
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{app.name}</p>
        <p className={styles.description}>{app.descriptionThai || '-'}</p>
      </div>
      <span
        className={styles.tag}
        style={{ backgroundColor: category.backgroundColor, borderColor: category.textColor, color: category.textColor }}
      >
        {category.label}
      </span>
      <button
        type="button"
        className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
        onClick={handleFavoriteClick}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `นำ ${app.name} ออกจากรายการโปรด` : `เพิ่ม ${app.name} เป็นรายการโปรด`}
      >
        <img src={isFavorite ? starFilledIcon : starOutlineIcon} alt="" width={20} height={20} />
      </button>
    </a>
  );
}
