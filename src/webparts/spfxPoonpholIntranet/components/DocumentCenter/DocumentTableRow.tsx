import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { DocumentItem } from '../../../../shared/types/content';
import { formatEnglishDateShort } from '../../../../shared/utils/formatEnglishDateShort';
import { DocumentTypeTag } from './DocumentTypeTag';
import { FileTypeBadge } from './FileTypeBadge';
import styles from './DocumentTable.module.scss';

export interface DocumentTableRowProps {
  document: DocumentItem;
}

export function DocumentTableRow({ document }: DocumentTableRowProps): React.ReactElement {
  return (
    <div className={styles.row}>
      <div className={styles.cellIcon}>
        <FileTypeBadge fileType={document.fileType} />
      </div>
      <div className={styles.cellName}>
        <p className={styles.name}>{document.name}</p>
        <p className={styles.nameThai}>{document.nameThai}</p>
      </div>
      <div className={styles.cellType}>
        <DocumentTypeTag type={document.type} />
      </div>
      <div className={styles.cellDepartment}>{document.department}</div>
      <div className={styles.cellDate}>{formatEnglishDateShort(new Date(document.lastUpdate))}</div>
      <div className={styles.cellDownload}>
        <a href={document.fileUrl} className={styles.downloadButton} aria-label={`ดาวน์โหลด ${document.name}`}>
          <Icon name="download" size={18} />
        </a>
      </div>
    </div>
  );
}
