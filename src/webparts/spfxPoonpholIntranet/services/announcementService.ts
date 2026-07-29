import { spApi } from '../../../shared/services/api';
import { Announcement } from '../../../shared/types/content';
import { formatThaiDateTimeLabel } from '../../../shared/utils/formatThaiDateTimeLabel';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { stripHtml } from '../../../shared/utils/stripHtml';

const NEWS_LIST_TITLE = 'NewsList';
const ANNOUNCEMENT_TYPE_FILTER_VALUE = 'Announcement';
export const MAX_FEATURED_ANNOUNCEMENT_COUNT = 3;

// Announcements share the "NewsList" list with the News section, distinguished by the
// NewsType choice value. Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('NewsList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
const ANNOUNCEMENT_FIELDS = {
  id: 'Id',
  title: 'Title',
  pageContent: 'PageContent',
  publishDate: 'PublishDate',
  effectiveDate: 'EffectiveDate',
  active: 'Active',
  newsType: 'NewsType'
} as const;

interface ISPAnnouncementListItem {
  Id: number;
  Title: string;
  PageContent?: string;
  PublishDate?: string;
  EffectiveDate?: string;
  Active: boolean;
  NewsType?: string;
}

export interface AnnouncementFeedResult {
  items: Announcement[];
  totalCount: number;
}

export function mapToAnnouncement(raw: ISPAnnouncementListItem): Announcement {
  return {
    id: String(raw.Id),
    title: raw.Title,
    description: raw.PageContent ? stripHtml(raw.PageContent) : '',
    dateTimeLabel: raw.PublishDate ? formatThaiDateTimeLabel(new Date(raw.PublishDate)) : ''
  };
}

export function selectAnnouncementsByClosestEffectiveDate(
  activeItems: ISPAnnouncementListItem[],
  now: number,
  maxCount: number = MAX_FEATURED_ANNOUNCEMENT_COUNT
): ISPAnnouncementListItem[] {
  return selectClosestByDate(activeItems, item => item.EffectiveDate, now, maxCount);
}

export async function fetchAnnouncementFeed(): Promise<AnnouncementFeedResult> {
  const response = await spApi.get<{ value: ISPAnnouncementListItem[] }>(
    `/lists/getbytitle('${NEWS_LIST_TITLE}')/items`,
    {
      params: {
        $select: [
          ANNOUNCEMENT_FIELDS.id,
          ANNOUNCEMENT_FIELDS.title,
          ANNOUNCEMENT_FIELDS.pageContent,
          ANNOUNCEMENT_FIELDS.publishDate,
          ANNOUNCEMENT_FIELDS.effectiveDate,
          ANNOUNCEMENT_FIELDS.active,
          ANNOUNCEMENT_FIELDS.newsType
        ].join(','),
        $filter: `${ANNOUNCEMENT_FIELDS.active} eq 1 and ${ANNOUNCEMENT_FIELDS.newsType} eq '${ANNOUNCEMENT_TYPE_FILTER_VALUE}'`,
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
