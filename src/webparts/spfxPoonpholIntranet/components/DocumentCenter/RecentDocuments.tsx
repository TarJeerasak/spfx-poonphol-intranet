import * as React from 'react';
import { DocumentItem } from '../../../../shared/types/content';
import styles from './RecentDocuments.module.scss';

export interface RecentDocumentsProps {
  documents: DocumentItem[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps): React.ReactElement {
  return (
    <aside className={styles.card}>
      <span className={styles.title}>เอกสารใหม่</span>
      <div className={styles.divider} />
      <ul className={styles.list}>
        {documents.map(document => (
          <li key={document.id} className={styles.item}>
            <p className={styles.name}>{document.name}</p>
            <p className={styles.nameThai}>{document.nameThai}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
