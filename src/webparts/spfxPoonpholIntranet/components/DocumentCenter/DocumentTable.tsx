import * as React from 'react';
import { DocumentItem } from '../../../../shared/types/content';
import { DocumentTableRow } from './DocumentTableRow';
import styles from './DocumentTable.module.scss';

export interface DocumentTableProps {
  documents: DocumentItem[];
}

export function DocumentTable({ documents }: DocumentTableProps): React.ReactElement {
  if (documents.length === 0) {
    return <div className={styles.empty}>ไม่พบเอกสารที่ตรงกับเงื่อนไขที่เลือก</div>;
  }

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <div className={styles.cellName}>เอกสาร</div>
        <div className={styles.cellType}>ประเภท</div>
        <div className={styles.cellCompany}>บริษัท</div>
        <div className={styles.cellDepartment}>แผนก</div>
        <div className={styles.cellDate}>อัปเดตล่าสุด</div>
        <div className={styles.cellDownload} />
      </div>
      <div className={styles.body}>
        {documents.map(document => (
          <DocumentTableRow key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
