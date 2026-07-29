import * as React from 'react';
import { DocumentTypeTag as DocumentTypeTagValue } from '../../../../shared/types/content';
import styles from './DocumentTypeTag.module.scss';

const TYPE_COLORS: Record<DocumentTypeTagValue, { background: string; color: string }> = {
  Policy: { background: '#e3eefb', color: '#2563eb' },
  SOP: { background: '#e1f5ea', color: '#16a34a' },
  Form: { background: '#fdecd8', color: '#d97706' },
  Manual: { background: '#fce4ef', color: '#db2777' },
  Announcement: { background: '#efe4fc', color: '#7c3aed' },
  Report: { background: '#fce4e4', color: '#dc2626' },
  Template: { background: '#fdf3d8', color: '#b45309' }
};

export interface DocumentTypeTagProps {
  type: DocumentTypeTagValue;
}

export function DocumentTypeTag({ type }: DocumentTypeTagProps): React.ReactElement {
  const colors = TYPE_COLORS[type];
  return (
    <span className={styles.tag} style={{ backgroundColor: colors.background, color: colors.color }}>
      {type}
    </span>
  );
}
