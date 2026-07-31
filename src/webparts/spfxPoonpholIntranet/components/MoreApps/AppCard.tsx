import * as React from 'react';
import { AppCategory, AppItem } from '../../../../shared/types/content';
import humanResourcesIcon from '../../assets/more-apps/icons/human-resources.svg';
import exportIcon from '../../assets/more-apps/icons/export.svg';
import accountingIcon from '../../assets/more-apps/icons/accounting.svg';
import officeIcon from '../../assets/more-apps/icons/office.svg';
import businessIcon from '../../assets/more-apps/icons/business.svg';
import dtIcon from '../../assets/more-apps/icons/dt.svg';
import starFilledIcon from '../../assets/more-apps/icons/star-filled.svg';
import starOutlineIcon from '../../assets/more-apps/icons/star-outline.svg';
import styles from './AppCard.module.scss';

const CATEGORY_ICONS: string[] = [humanResourcesIcon, exportIcon, accountingIcon, officeIcon, businessIcon, dtIcon];

function getCategoryIcon(categoryId: string): string {
  const hash = Array.from(categoryId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return CATEGORY_ICONS[hash % CATEGORY_ICONS.length];
}

export interface AppCardProps {
  app: AppItem;
  category: AppCategory;
  isFavorite: boolean;
  isVisible: boolean;
  revealDelay: number;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

export function AppCard({ app, category, isFavorite, isVisible, revealDelay, onToggleFavorite, onOpen }: AppCardProps): React.ReactElement {
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
      className={`${styles.card} ${isVisible ? styles.isVisible : ''}`}
      style={{ transitionDelay: isVisible ? `${revealDelay}ms` : '0ms' }}
      onClick={onOpen}
    >
      <div className={styles.iconTile} style={{ backgroundColor: category.backgroundColor }}>
        <img src={getCategoryIcon(app.categoryId)} alt="" width={20} height={20} />
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{app.name}</p>
        <p className={styles.description}>{app.descriptionThai}</p>
        <span
          className={styles.tag}
          style={{ backgroundColor: category.backgroundColor, borderColor: category.textColor, color: category.textColor }}
        >
          {category.label}
        </span>
      </div>
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
