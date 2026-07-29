import { spApi } from '../../../shared/services/api';
import { NewsItem } from '../../../shared/types/content';
import { formatThaiDate } from '../../../shared/utils/formatThaiDate';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';

const NEWS_LIST_TITLE = 'NewsList';
const NEWS_TAG_COLOR = '#63b37d';
export const MAX_FEATURED_NEWS_COUNT = 4;

// Internal names guessed from the list's display names. If the list was created with
// spaces in the display name (e.g. "Effective Date"), SharePoint may have generated a
// different internal name (e.g. "Effective_x0020_Date") - verify against
// `${SiteURL}/_api/web/lists/getbytitle('NewsList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
const NEWS_FIELDS = {
  id: 'Id',
  title: 'Title',
  shortDescription: 'ShortDescription',
  thumbnailImage: 'ThumbnailImage',
  company: 'Company',
  publishDate: 'PublishDate',
  effectiveDate: 'EffectiveDate',
  active: 'Active'
} as const;

interface ISPNewsListItem {
  Id: number;
  Title: string;
  ShortDescription?: string;
  ThumbnailImage?: string;
  Company?: { Title: string };
  PublishDate?: string;
  EffectiveDate?: string;
  Active: boolean;
}

export interface NewsFeedResult {
  feature: NewsItem | undefined;
  items: NewsItem[];
  totalCount: number;
}

export function mapToNewsItem(raw: ISPNewsListItem): NewsItem {
  return {
    id: String(raw.Id),
    title: raw.Title,
    excerpt: raw.ShortDescription ?? '',
    imageUrl: parseThumbnailImage(raw.ThumbnailImage),
    tag: raw.Company?.Title ?? '',
    tagColor: NEWS_TAG_COLOR,
    dateLabel: raw.PublishDate ? formatThaiDate(new Date(raw.PublishDate)) : '',
    timeLabel: '',
    locationLabel: raw.Company?.Title ?? ''
  };
}

export function selectNewsItemsByClosestEffectiveDate(
  activeItems: ISPNewsListItem[],
  now: number,
  maxCount: number = MAX_FEATURED_NEWS_COUNT
): ISPNewsListItem[] {
  return selectClosestByDate(activeItems, item => item.EffectiveDate, now, maxCount);
}

export async function fetchNewsFeed(): Promise<NewsFeedResult> {
  const response = await spApi.get<{ value: ISPNewsListItem[] }>(
    `/lists/getbytitle('${NEWS_LIST_TITLE}')/items`,
    {
      params: {
        $select: [
          NEWS_FIELDS.id,
          NEWS_FIELDS.title,
          NEWS_FIELDS.shortDescription,
          NEWS_FIELDS.thumbnailImage,
          `${NEWS_FIELDS.company}/Title`,
          NEWS_FIELDS.publishDate,
          NEWS_FIELDS.effectiveDate,
          NEWS_FIELDS.active
        ].join(','),
        $expand: NEWS_FIELDS.company,
        $filter: `${NEWS_FIELDS.active} eq 1`,
        $top: 5000
      }
    }
  );

  const activeItems = response.data.value;
  const topItems = selectNewsItemsByClosestEffectiveDate(activeItems, Date.now()).map(mapToNewsItem);

  return {
    feature: topItems[0],
    items: topItems.slice(1),
    totalCount: activeItems.length
  };
}
