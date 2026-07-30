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

const CATEGORY_ICON_BY_ID: Record<string, string> = {
  'human-resources': humanResourcesIcon,
  export: exportIcon,
  accounting: accountingIcon,
  office: officeIcon,
  business: businessIcon,
  dt: dtIcon
};

export interface AppCardProps {
  app: AppItem;
  category: AppCategory;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function AppCard({ app, category, isFavorite, onToggleFavorite }: AppCardProps): React.ReactElement {
  return (
    <div className={styles.card}>
      <div className={styles.iconTile} style={{ backgroundColor: category.backgroundColor }}>
        <img src={CATEGORY_ICON_BY_ID[app.categoryId]} alt="" width={20} height={20} />
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
        className={styles.favoriteButton}
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `นำ ${app.name} ออกจากรายการโปรด` : `เพิ่ม ${app.name} เป็นรายการโปรด`}
      >
        <img src={isFavorite ? starFilledIcon : starOutlineIcon} alt="" width={20} height={20} />
      </button>
    </div>
  );
}
