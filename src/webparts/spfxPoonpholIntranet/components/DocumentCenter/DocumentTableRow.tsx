import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { DocumentItem } from '../../../../shared/types/content';
import { formatThaiDateShort } from '../../../../shared/utils/formatThaiDateShort';
import { DocumentTypeTag } from './DocumentTypeTag';
import styles from './DocumentTable.module.scss';

export interface DocumentTableRowProps {
  document: DocumentItem;
}

export function DocumentTableRow({ document }: DocumentTableRowProps): React.ReactElement {
  return (
    <div className={styles.row}>
      <div className={styles.cellName}>
        <p className={styles.name}>{document.name}</p>
        <p className={styles.nameThai}>{document.nameThai}</p>
      </div>
      <div className={styles.cellType}>
        <DocumentTypeTag type={document.type} />
      </div>
      <div className={styles.cellCompany}>{document.company}</div>
      <div className={styles.cellDepartment}>{document.department}</div>
      <div className={styles.cellDate}>{formatThaiDateShort(new Date(document.lastUpdate))}</div>
      <div className={styles.cellDownload}>
        <a
          href={document.fileUrl}
          data-interception="off"
          className={styles.downloadButton}
          aria-label={`ดาวน์โหลด ${document.name}`}
        >
          <Icon name="download" size={18} />
        </a>
      </div>
    </div>
  );
}
