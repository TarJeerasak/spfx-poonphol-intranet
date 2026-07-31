import * as React from 'react';
import { IconTile } from '../../../../shared/components/IconTile/IconTile';
import { DocumentCategorySummary } from '../../../../shared/types/content';
import policyIcon from '../../assets/document-center/icons/policy.svg';
import sopIcon from '../../assets/document-center/icons/sop.svg';
import formIcon from '../../assets/document-center/icons/form.svg';
import announcementIcon from '../../assets/document-center/icons/announcement.svg';
import manualIcon from '../../assets/document-center/icons/manual.svg';
import styles from './CategoryCard.module.scss';

const CATEGORY_ICON_BY_ID: Record<string, string> = {
  policy: policyIcon,
  sop: sopIcon,
  form: formIcon,
  announcement: announcementIcon,
  manual: manualIcon
};

export interface CategoryCardProps {
  summary: DocumentCategorySummary;
  isActive: boolean;
  onSelect: () => void;
}

export function CategoryCard({ summary, isActive, onSelect }: CategoryCardProps): React.ReactElement {
  return (
    <button
      type="button"
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
      aria-pressed={isActive}
    >
      <IconTile shape="circle" size={63} iconSize={42} iconUrl={CATEGORY_ICON_BY_ID[summary.id]} backgroundColor="#ddebe4" />
      <div className={styles.text}>
        <p className={styles.label}>{summary.label}</p>
        <p className={styles.labelThai}>{summary.labelThai}</p>
        <p className={styles.count}>
          <span className={styles.countNumber}>{summary.count}</span>
          <span className={styles.countUnit}>เอกสาร</span>
        </p>
      </div>
    </button>
  );
}
