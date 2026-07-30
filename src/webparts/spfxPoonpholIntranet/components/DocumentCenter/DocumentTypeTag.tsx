import * as React from 'react';
import { DocumentTypeTag as DocumentTypeTagValue } from '../../../../shared/types/content';
import styles from './DocumentTypeTag.module.scss';

const TYPE_COLORS: Record<DocumentTypeTagValue, { background: string; color: string }> = {
  Policy: { background: '#d8e8ff', color: '#116ffb' },
  SOP: { background: '#e0fff2', color: '#0e5536' },
  Form: { background: '#ffe3d3', color: '#d46628' },
  Manual: { background: '#cadfff', color: '#062b62' },
  Announcement: { background: '#dcbcff', color: '#3d0e70' },
  Report: { background: '#ffcacd', color: '#870007' },
  Template: { background: '#fff7e4', color: '#be8a09' }
};

export interface DocumentTypeTagProps {
  type: DocumentTypeTagValue;
}

export function DocumentTypeTag({ type }: DocumentTypeTagProps): React.ReactElement {
  const colors = TYPE_COLORS[type];
  return (
    <span className={styles.tag} style={{ backgroundColor: colors.background, borderColor: colors.color, color: colors.color }}>
      {type}
    </span>
  );
}
