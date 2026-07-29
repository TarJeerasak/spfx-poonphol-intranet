import * as React from 'react';
import { IconTile } from '../../../../shared/components/IconTile/IconTile';
import { IconName } from '../../../../shared/components/Icon/Icon';
import { DocumentCategorySummary } from '../../../../shared/types/content';
import styles from './CategoryCard.module.scss';

export interface CategoryCardProps {
  summary: DocumentCategorySummary;
}

export function CategoryCard({ summary }: CategoryCardProps): React.ReactElement {
  return (
    <div className={styles.card}>
      <IconTile
        shape="circle"
        size={64}
        iconSize={28}
        iconName={summary.iconName as IconName}
        iconColor={summary.tintColor}
        backgroundColor="#eaf6f0"
      />
      <div className={styles.text}>
        <p className={styles.label}>{summary.label}</p>
        <p className={styles.labelThai}>{summary.labelThai}</p>
        <p className={styles.count}>
          <span className={styles.countNumber}>{summary.count}</span>
          <span className={styles.countUnit}>เอกสาร</span>
        </p>
      </div>
    </div>
  );
}
