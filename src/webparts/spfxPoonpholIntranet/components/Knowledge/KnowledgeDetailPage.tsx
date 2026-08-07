import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dropdown } from '../../../../shared/components/Dropdown/Dropdown';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Tag } from '../../../../shared/components/Tag/Tag';
import { formatReadCountLabel } from '../../../../shared/utils/formatReadCountLabel';
import { formatThaiDateShort } from '../../../../shared/utils/formatThaiDateShort';
import { isImageFileType } from '../../../../shared/utils/isImageFileType';
import { parseDescriptionSegments } from '../../../../shared/utils/parseDescriptionLinks';
import { useAttachmentSizeLabels } from '../../hooks/useAttachmentSizeLabels';
import { useKnowledgeFeed } from '../../hooks/useKnowledgeFeed';
import { useKnowledgeLikes } from '../../hooks/useKnowledgeLikes';
import { KnowledgeGridCard } from './KnowledgeGridCard';
import { KnowledgeImageGallery } from './KnowledgeImageGallery';
import backChevronIcon from '../../assets/knowledge/icons/back-chevron.svg';
import filePdfIcon from '../../assets/knowledge/icons/file-pdf.svg';
import fileWordIcon from '../../assets/knowledge/icons/file-word.svg';
import styles from './KnowledgeDetailPage.module.scss';

const RECOMMENDED_CARD_COUNT = 4;
const ALL_CATEGORY_VALUE = 'all';

const ATTACHMENT_ICON_URL_BY_FILE_TYPE: Record<string, string> = {
  PDF: filePdfIcon,
  DOC: fileWordIcon,
  DOCX: fileWordIcon
};

export function KnowledgeDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { items, categories, isLoading, recordRead } = useKnowledgeFeed();
  const { getLikeState, toggleLike } = useKnowledgeLikes(items);
  const [recommendedCategoryId, setRecommendedCategoryId] = React.useState(ALL_CATEGORY_VALUE);

  const item = items.find(candidate => candidate.id === id);
  const documentAttachments = (item?.attachments ?? []).filter(attachment => !isImageFileType(attachment.fileType));
  const attachmentSizeLabelByUrl = useAttachmentSizeLabels(documentAttachments);

  React.useEffect(() => {
    if (item) {
      recordRead(item.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

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
        <p className={styles.stateMessage}>ไม่พบเนื้อหาที่ต้องการ</p>
        <Link to="/knowledge" className={styles.backLink}>
          <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
          กลับไปหน้าความรู้
        </Link>
      </div>
    );
  }

  const likeState = getLikeState(item);
  const imageAttachments = item.attachments.filter(attachment => isImageFileType(attachment.fileType));
  const galleryImageUrls = Array.from(new Set([item.imageUrl, ...imageAttachments.map(attachment => attachment.url)].filter(Boolean)));
  const categoryOptions = [
    { value: ALL_CATEGORY_VALUE, label: 'ทุกหมวดหมู่' },
    ...categories.filter(category => category.id !== ALL_CATEGORY_VALUE).map(category => ({ value: category.id, label: category.label }))
  ];
  const otherItems = items.filter(candidate => candidate.id !== item.id);
  const recommendedItems = otherItems
    .filter(candidate => candidate.isRecommended)
    .filter(candidate => recommendedCategoryId === ALL_CATEGORY_VALUE || candidate.categoryId === recommendedCategoryId)
    .slice(0, RECOMMENDED_CARD_COUNT);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.mainColumn}>
          <Link to="/knowledge" className={styles.backLink}>
            <img src={backChevronIcon} alt="" className={styles.backLinkIcon} />
            BACK
          </Link>

          <div className={styles.headerBlock}>
            {item.categoryId && <Tag label={item.categoryId} color="#cadfff" textColor="#062b62" borderColor="#062b62" />}
            <h1 className={styles.title}>{item.title}</h1>
            {item.shortDescription && <p className={styles.shortDescription}>{item.shortDescription}</p>}
          </div>

          <div className={styles.metaRow}>
            {item.modifiedAt && (
              <span className={styles.metaItem}>
                <Icon name="calendar" size={16} />
                อัปเดตล่าสุด {formatThaiDateShort(new Date(item.modifiedAt))}
              </span>
            )}
            <span className={styles.metaItem}>
              <Icon name="eye" size={16} />
              {formatReadCountLabel(item.readCount)}
            </span>
            <button
              type="button"
              className={styles.likeButton}
              onClick={() => toggleLike(item)}
              disabled={likeState.isSaving}
              aria-pressed={likeState.isLiked}
              aria-label={likeState.isLiked ? `นำ ${item.title} ออกจากรายการที่ถูกใจ` : `เพิ่ม ${item.title} เป็นรายการที่ถูกใจ`}
            >
              <Icon name="heart" size={16} className={likeState.isLiked ? styles.heartIconActive : styles.heartIcon} />
              <span className={styles.likeCount}>{likeState.likeCount}</span>
            </button>
          </div>

          {galleryImageUrls.length > 1 ? (
            <KnowledgeImageGallery images={galleryImageUrls} />
          ) : (
            <div className={styles.hero}>
              <div className={styles.heroImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
            </div>
          )}

          {item.description && (
            <div className={styles.detailsSection}>
              <p className={styles.detailsTitle}>รายละเอียด</p>
              <p className={styles.detailsText}>
                {parseDescriptionSegments(item.description).map((segment, index) =>
                  segment.type === 'link' ? (
                    <a key={index} href={segment.href} target="_blank" rel="noopener noreferrer" className={styles.detailsLink}>
                      {segment.value}
                    </a>
                  ) : (
                    <React.Fragment key={index}>{segment.value}</React.Fragment>
                  )
                )}
              </p>
            </div>
          )}
        </div>

        <div className={styles.sidebarColumn}>
          {(item.categoryId || item.createdAt || item.modifiedAt) && (
            <section className={styles.sidebarPanel}>
              <p className={styles.sidebarPanelTitle}>ข้อมูลบทเรียน (Information)</p>
              <div className={styles.sidebarPanelDivider} />
              {item.categoryId && (
                <div className={styles.infoField}>
                  <p className={styles.infoLabel}>หมวดหมู่</p>
                  <p className={styles.infoValue}>{item.categoryId}</p>
                </div>
              )}
              <div className={styles.infoField}>
                <p className={styles.infoLabel}>ผู้เขียน</p>
                <p className={styles.infoValue}>{item.authorName || 'ไม่ระบุข้อมูล'}</p>
              </div>
              {item.createdAt && (
                <div className={styles.infoField}>
                  <p className={styles.infoLabel}>วันที่สร้าง</p>
                  <p className={styles.infoValue}>{formatThaiDateShort(new Date(item.createdAt))}</p>
                </div>
              )}
              {item.modifiedAt && (
                <div className={styles.infoField}>
                  <p className={styles.infoLabel}>อัปเดตล่าสุด</p>
                  <p className={styles.infoValue}>{formatThaiDateShort(new Date(item.modifiedAt))}</p>
                </div>
              )}
            </section>
          )}

          {item.tags.length > 0 && (
            <section className={styles.sidebarPanel}>
              <p className={styles.sidebarPanelTitle}>แท็ก (Tags)</p>
              <div className={styles.sidebarPanelDivider} />
              <div className={styles.tagList}>
                {item.tags.map(tag => (
                  <Tag key={tag} label={tag} color="#cadfff" textColor="#062b62" borderColor="#062b62" />
                ))}
              </div>
            </section>
          )}

          <section className={styles.sidebarPanel}>
            <p className={styles.sidebarPanelTitle}>ไฟล์แนบ (Attachments)</p>
            <div className={styles.sidebarPanelDivider} />
            {documentAttachments.length === 0 ? (
              <p className={styles.attachmentEmptyMessage}>ไม่พบไฟล์แนบ</p>
            ) : (
              <div className={styles.attachmentList}>
                {documentAttachments.map(attachment => {
                  const iconUrl = ATTACHMENT_ICON_URL_BY_FILE_TYPE[attachment.fileType];
                  const sizeLabel = attachmentSizeLabelByUrl[attachment.url];

                  const querySeparator = attachment.url.includes('?') ? '&' : '?';

                  return (
                    <div key={attachment.url} className={styles.attachmentRow}>
                      <a
                        className={styles.attachmentOpenLink}
                        href={`${attachment.url}${querySeparator}web=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-interception="off"
                      >
                        {iconUrl ? (
                          <img src={iconUrl} alt="" className={styles.attachmentIconImage} />
                        ) : (
                          <Icon name="document" size={24} className={styles.attachmentIcon} />
                        )}
                        <span className={styles.attachmentText}>
                          <span className={styles.attachmentName}>{attachment.name}</span>
                          <span className={styles.attachmentType}>
                            {attachment.fileType}
                            {sizeLabel ? ` (${sizeLabel})` : ''}
                          </span>
                        </span>
                      </a>
                      <a
                        className={styles.attachmentDownloadLink}
                        href={`${attachment.url}${querySeparator}download=1`}
                        download={attachment.name}
                        aria-label={`ดาวน์โหลด ${attachment.name}`}
                        title={`ดาวน์โหลด ${attachment.name}`}
                        data-interception="off"
                      >
                        <Icon name="download" size={16} className={styles.attachmentDownloadIcon} />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {otherItems.length > 0 && (
        <div className={styles.recommendedContainer}>
          <section className={styles.recommendedPanel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>บทเรียนแนะนำ</p>
              <Dropdown
                label="กรองตามหมวดหมู่"
                value={recommendedCategoryId}
                options={categoryOptions}
                onChange={setRecommendedCategoryId}
              />
            </div>
            <div className={styles.panelDivider} />
            {recommendedItems.length > 0 ? (
              <div className={styles.cardGrid}>
                {recommendedItems.map(recommendedItem => (
                  <KnowledgeGridCard
                    key={recommendedItem.id}
                    item={recommendedItem}
                    likeState={getLikeState(recommendedItem)}
                    to={`/knowledge/${recommendedItem.id}`}
                    onToggleLike={() => toggleLike(recommendedItem)}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>ไม่พบความรู้ที่ตรงกับเงื่อนไขที่เลือก</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
