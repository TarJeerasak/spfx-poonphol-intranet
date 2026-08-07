import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { useAllAnnouncementsFeed } from '../../hooks/useAllAnnouncementsFeed';
import backChevronIcon from '../../assets/knowledge/icons/back-chevron.svg';
import filePdfIcon from '../../assets/knowledge/icons/file-pdf.svg';
import fileWordIcon from '../../assets/knowledge/icons/file-word.svg';
import shareIcon from '../../assets/announcements/icons/share.svg';
import styles from './AnnouncementDetailPage.module.scss';

const ATTACHMENT_ICON_URL_BY_FILE_TYPE: Record<string, string> = {
  PDF: filePdfIcon,
  DOC: fileWordIcon,
  DOCX: fileWordIcon
};

export function AnnouncementDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { items, isLoading } = useAllAnnouncementsFeed();
  const [hasCopiedLink, setHasCopiedLink] = React.useState(false);

  const item = items.find(candidate => candidate.id === id);

  const handleShare = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setHasCopiedLink(true);
      window.setTimeout(() => setHasCopiedLink(false), 2000);
    } catch {
      // Clipboard access can be denied by the browser - sharing is a non-critical nicety here.
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateMessage}>กำลังโหลด...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.page}>
        <p className={styles.stateMessage}>ไม่พบประกาศที่ต้องการ</p>
        <Link to="/announcements" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          กลับไปหน้าประกาศ
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/announcements" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          BACK
        </Link>

        <div className={styles.card}>
          <div className={styles.headerBlock}>
            {item.typeLabel && (
              <Tag label={item.typeLabel} color={item.typeColor} textColor={item.typeTextColor} borderColor={item.typeBorderColor} />
            )}
            <h1 className={styles.title}>{item.title}</h1>
            <div className={styles.metaRow}>
              <div className={styles.metaGroup}>
                {item.updatedLabel && (
                  <span className={styles.metaItem}>
                    <Icon name="calendar" size={16} />
                    อัปเดตล่าสุด {item.updatedLabel}
                  </span>
                )}
              </div>
              <button type="button" className={styles.shareButton} onClick={handleShare}>
                <span className={styles.shareIconCircle}>
                  <img src={shareIcon} alt="" width={16} height={16} />
                </span>
                {hasCopiedLink ? 'คัดลอกลิงก์แล้ว' : 'แชร์'}
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          {item.description && <p className={styles.detailsText}>{item.description}</p>}

          {item.attachments.length > 0 && (
            <div className={styles.attachmentsSection}>
              <p className={styles.attachmentsTitle}>ไฟล์แนบ (Attachments)</p>
              <div className={styles.attachmentList}>
                {item.attachments.map(attachment => {
                  const iconUrl = ATTACHMENT_ICON_URL_BY_FILE_TYPE[attachment.fileType];

                  return (
                    <a key={attachment.url} className={styles.attachmentRow} href={attachment.url} data-interception="off">
                      {iconUrl ? (
                        <img src={iconUrl} alt="" className={styles.attachmentIconImage} />
                      ) : (
                        <Icon name="document" size={24} className={styles.attachmentIcon} />
                      )}
                      <span className={styles.attachmentText}>
                        <span className={styles.attachmentName}>{attachment.name}</span>
                        <span className={styles.attachmentType}>{attachment.fileType}</span>
                      </span>
                      <Icon name="download" size={16} className={styles.attachmentDownloadIcon} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
