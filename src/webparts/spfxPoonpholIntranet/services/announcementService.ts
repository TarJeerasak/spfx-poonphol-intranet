import { spApi } from '../../../shared/services/api';
import { Announcement, AnnouncementAttachment } from '../../../shared/types/content';
import { formatThaiDateShort } from '../../../shared/utils/formatThaiDateShort';
import { formatThaiDateTimeLabel } from '../../../shared/utils/formatThaiDateTimeLabel';
import { IAttachmentFile } from '../../../shared/utils/resolveListItemImageUrl';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { SITE_ORIGIN } from '../../../shared/utils/siteOrigin';
import { stripHtml } from '../../../shared/utils/stripHtml';

const NEWS_LIST_TITLE = 'NewsList';
const ANNOUNCEMENT_TYPE_FILTER_VALUE = 'Announcement';
export const MAX_FEATURED_ANNOUNCEMENT_COUNT = 3;

// Announcements share the "NewsList" list with the News section, distinguished by the
// NewsType choice value. Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('NewsList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
// AnnouncementType is a Choice column (ด่วน/สำคัญ/ทั่วไป/ปิดประกาศ) added alongside this feature -
// verify its internal name once the column exists in the live list.
const ANNOUNCEMENT_FIELDS = {
  id: 'Id',
  title: 'Title',
  pageContent: 'PageContent',
  publishDate: 'PublishDate',
  effectiveDate: 'EffectiveDate',
  active: 'Active',
  newsType: 'NewsType',
  announcementType: 'AnnouncementType',
  modified: 'Modified'
} as const;

interface ISPAnnouncementListItem {
  Id: number;
  Title: string;
  PageContent?: string;
  PublishDate?: string;
  EffectiveDate?: string;
  Active: boolean;
  NewsType?: string;
  AnnouncementType?: string;
  Modified?: string;
  AttachmentFiles?: IAttachmentFile[];
}

export interface AnnouncementFeedResult {
  items: Announcement[];
  totalCount: number;
}

// SharePoint choice-pill colors aren't exposed over REST, so they're re-declared here to
// visually match the AnnouncementType choice column's colors. Unrecognized/future values fall
// back to the "ทั่วไป" (general) style.
const ANNOUNCEMENT_TYPE_STYLES: Record<string, { color: string; textColor: string; borderColor: string }> = {
  ด่วน: { color: '#ffcacd', textColor: '#870007', borderColor: '#870007' },
  สำคัญ: { color: '#fff7e4', textColor: '#be8a09', borderColor: '#be8a09' },
  ทั่วไป: { color: '#e0fff2', textColor: '#0e5536', borderColor: '#0e5536' },
  ปิดประกาศ: { color: '#d3d2d2', textColor: '#9c9c9c', borderColor: '#9c9c9c' }
};

// Tabs and the AnnouncementType choice column should agree on ordering so the filter UI reads
// the same way the choices were authored in SharePoint.
export const ANNOUNCEMENT_TYPE_ORDER = ['ด่วน', 'สำคัญ', 'ทั่วไป', 'ปิดประกาศ'];

function getAnnouncementTypeStyle(typeLabel: string): { color: string; textColor: string; borderColor: string } {
  return ANNOUNCEMENT_TYPE_STYLES[typeLabel] ?? ANNOUNCEMENT_TYPE_STYLES['ทั่วไป'];
}

export function buildAnnouncementAttachments(attachmentFiles: IAttachmentFile[] | undefined): AnnouncementAttachment[] {
  if (!attachmentFiles) {
    return [];
  }

  return attachmentFiles.map(file => {
    const name = file.ServerRelativeUrl.split('/').pop() ?? file.ServerRelativeUrl;
    const fileType = name.split('.').pop()?.toUpperCase() ?? '';

    return { name, url: `${SITE_ORIGIN}${file.ServerRelativeUrl}`, fileType };
  });
}

export function mapToAnnouncement(raw: ISPAnnouncementListItem): Announcement {
  const typeLabel = raw.AnnouncementType ?? '';
  const typeStyle = getAnnouncementTypeStyle(typeLabel);

  return {
    id: String(raw.Id),
    title: raw.Title,
    description: raw.PageContent ? stripHtml(raw.PageContent) : '',
    publishedAtIso: raw.PublishDate ?? '',
    dateTimeLabel: raw.PublishDate ? formatThaiDateTimeLabel(new Date(raw.PublishDate)) : '',
    dateLabel: raw.PublishDate ? formatThaiDateShort(new Date(raw.PublishDate)) : '',
    updatedLabel: raw.Modified ? formatThaiDateShort(new Date(raw.Modified)) : '',
    typeLabel,
    typeColor: typeStyle.color,
    typeTextColor: typeStyle.textColor,
    typeBorderColor: typeStyle.borderColor,
    attachments: buildAnnouncementAttachments(raw.AttachmentFiles)
  };
}

export function selectAnnouncementsByClosestEffectiveDate(
  activeItems: ISPAnnouncementListItem[],
  now: number,
  maxCount: number = MAX_FEATURED_ANNOUNCEMENT_COUNT
): ISPAnnouncementListItem[] {
  return selectClosestByDate(activeItems, item => item.EffectiveDate, now, maxCount);
}

const ANNOUNCEMENT_SELECT_FIELDS = [
  ANNOUNCEMENT_FIELDS.id,
  ANNOUNCEMENT_FIELDS.title,
  ANNOUNCEMENT_FIELDS.pageContent,
  ANNOUNCEMENT_FIELDS.publishDate,
  ANNOUNCEMENT_FIELDS.effectiveDate,
  ANNOUNCEMENT_FIELDS.active,
  ANNOUNCEMENT_FIELDS.newsType,
  ANNOUNCEMENT_FIELDS.announcementType,
  ANNOUNCEMENT_FIELDS.modified,
  'AttachmentFiles/ServerRelativeUrl'
].join(',');
const ANNOUNCEMENT_FILTER = `${ANNOUNCEMENT_FIELDS.active} eq 1 and ${ANNOUNCEMENT_FIELDS.newsType} eq '${ANNOUNCEMENT_TYPE_FILTER_VALUE}'`;

export async function fetchAnnouncementFeed(): Promise<AnnouncementFeedResult> {
  const response = await spApi.get<{ value: ISPAnnouncementListItem[] }>(
    `/lists/getbytitle('${NEWS_LIST_TITLE}')/items`,
    {
      params: {
        $select: ANNOUNCEMENT_SELECT_FIELDS,
        $expand: 'AttachmentFiles',
        $filter: ANNOUNCEMENT_FILTER,
        $top: 5000
      }
    }
  );

  const activeItems = response.data.value;
  const items = selectAnnouncementsByClosestEffectiveDate(activeItems, Date.now()).map(mapToAnnouncement);

  return {
    items,
    totalCount: activeItems.length
  };
}

export async function fetchAllActiveAnnouncements(): Promise<Announcement[]> {
  const response = await spApi.get<{ value: ISPAnnouncementListItem[] }>(
    `/lists/getbytitle('${NEWS_LIST_TITLE}')/items`,
    {
      params: {
        $select: ANNOUNCEMENT_SELECT_FIELDS,
        $expand: 'AttachmentFiles',
        $filter: ANNOUNCEMENT_FILTER,
        $orderby: `${ANNOUNCEMENT_FIELDS.publishDate} desc`,
        $top: 5000
      }
    }
  );

  return response.data.value.map(mapToAnnouncement);
}

export function getAnnouncementTypeOptions(items: Announcement[]): string[] {
  const present = new Set(items.map(item => item.typeLabel).filter(Boolean));
  const ordered = ANNOUNCEMENT_TYPE_ORDER.filter(type => present.has(type));
  const unknown = Array.from(present).filter(type => ANNOUNCEMENT_TYPE_ORDER.indexOf(type) === -1);

  return [...ordered, ...unknown];
}

export interface AnnouncementFilters {
  search: string;
  type: string;
}

export const ALL_ANNOUNCEMENT_TYPE_VALUE = 'all';

export const DEFAULT_ANNOUNCEMENT_FILTERS: AnnouncementFilters = {
  search: '',
  type: ALL_ANNOUNCEMENT_TYPE_VALUE
};

export function filterAnnouncements(items: Announcement[], filters: AnnouncementFilters): Announcement[] {
  const search = filters.search.trim().toLowerCase();

  return items.filter(item => {
    const matchesSearch = search.length === 0 || item.title.toLowerCase().includes(search);
    const matchesType = filters.type === ALL_ANNOUNCEMENT_TYPE_VALUE || item.typeLabel === filters.type;

    return matchesSearch && matchesType;
  });
}

export type AnnouncementSortOrder = 'latest' | 'oldest';

export function sortAnnouncements(items: Announcement[], order: AnnouncementSortOrder): Announcement[] {
  const sorted = [...items].sort((a, b) => new Date(a.publishedAtIso).getTime() - new Date(b.publishedAtIso).getTime());
  return order === 'latest' ? sorted.reverse() : sorted;
}

export interface PaginatedAnnouncements {
  items: Announcement[];
  page: number;
  pageCount: number;
  totalCount: number;
}

export function paginateAnnouncements(items: Announcement[], page: number, pageSize: number): PaginatedAnnouncements {
  const totalCount = items.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageCount,
    totalCount
  };
}
