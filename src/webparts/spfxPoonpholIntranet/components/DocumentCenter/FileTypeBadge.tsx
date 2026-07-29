import * as React from 'react';
import { DocumentFileType } from '../../../../shared/types/content';
import styles from './FileTypeBadge.module.scss';

const FILE_TYPE_META: Record<DocumentFileType, { label: string; color: string }> = {
  word: { label: 'DOC', color: '#2b579a' },
  excel: { label: 'XLS', color: '#217346' },
  pdf: { label: 'PDF', color: '#c0392b' },
  powerpoint: { label: 'PPT', color: '#d24726' }
};

export interface FileTypeBadgeProps {
  fileType: DocumentFileType;
}

export function FileTypeBadge({ fileType }: FileTypeBadgeProps): React.ReactElement {
  const meta = FILE_TYPE_META[fileType];
  return (
    <span className={styles.badge} style={{ backgroundColor: meta.color }}>
      {meta.label}
    </span>
  );
}
