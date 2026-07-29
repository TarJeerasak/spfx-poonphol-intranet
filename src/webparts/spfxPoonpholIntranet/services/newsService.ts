import { spApi } from '../../../shared/services/api';
import { NewsItem } from '../../../shared/types/content';
import { buildUserPhotoUrl } from '../../../shared/utils/buildUserPhotoUrl';
import { formatThaiDateShort } from '../../../shared/utils/formatThaiDateShort';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { stripHtml } from '../../../shared/utils/stripHtml';

const NEWS_LIST_TITLE = 'NewsList';
const DEFAULT_TAG_COLOR = '#63b37d';
const NEWS_TYPE_FILTER_VALUE = 'News';
export const MAX_FEATURED_NEWS_COUNT = 4;

// Category is a Choice column (e.g. "Business", "Activities") - SharePoint choice pill colors
// aren't exposed over REST, so tag colors are re-declared here to visually match the list's
// choice colors. Unrecognized/future categories fall back to DEFAULT_TAG_COLOR.
const CATEGORY_TAG_COLORS: Record<string, string> = {
  Business: '#63b37d',
  Activities: '#e2445c'
};

function getCategoryTagColor(category: string): string {
  return CATEGORY_TAG_COLORS[category] ?? DEFAULT_TAG_COLOR;
}

// Internal names guessed from the list's display names. If the list was created with
// spaces in the display name (e.g. "Effective Date"), SharePoint may have generated a
// different internal name (e.g. "Effective_x0020_Date") - verify against
// `${SiteURL}/_api/web/lists/getbytitle('NewsList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
// "Created By" is exposed over REST as the "Author" person field.
const NEWS_FIELDS = {
  id: 'Id',
  title: 'Title',
  pageContent: 'PageContent',
  thumbnailImage: 'ThumbnailImage',
  publishDate: 'PublishDate',
  effectiveDate: 'EffectiveDate',
  active: 'Active',
  newsType: 'NewsType',
  category: 'Category',
  location: 'Location',
  time: 'Time',
  author: 'Author'
} as const;

interface ISPNewsListItem {
  Id: number;
  Title: string;
  PageContent?: string;
  ThumbnailImage?: string;
  PublishDate?: string;
  EffectiveDate?: string;
  Active: boolean;
  NewsType?: string;
  Category?: string;
  Location?: string;
  Time?: string;
  Author?: {
    Title: string;
    EMail?: string;
  };
}

export interface NewsFeedResult {
  feature: NewsItem | undefined;
  items: NewsItem[];
  totalCount: number;
}

export function mapToNewsItem(raw: ISPNewsListItem): NewsItem {
  const category = raw.Category ?? '';

  return {
    id: String(raw.Id),
    title: raw.Title,
    excerpt: raw.PageContent ? stripHtml(raw.PageContent) : '',
    imageUrl: parseThumbnailImage(raw.ThumbnailImage),
    tag: category,
    tagColor: getCategoryTagColor(category),
    dateLabel: raw.PublishDate ? formatThaiDateShort(new Date(raw.PublishDate)) : '',
    timeLabel: raw.Time ?? '',
    locationLabel: raw.Location ?? '',
    authorName: raw.Author?.Title ?? '',
    authorAvatarUrl: buildUserPhotoUrl(raw.Author?.EMail)
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
          NEWS_FIELDS.pageContent,
          NEWS_FIELDS.thumbnailImage,
          NEWS_FIELDS.publishDate,
          NEWS_FIELDS.effectiveDate,
          NEWS_FIELDS.active,
          NEWS_FIELDS.newsType,
          NEWS_FIELDS.category,
          NEWS_FIELDS.location,
          NEWS_FIELDS.time,
          `${NEWS_FIELDS.author}/Title`,
          `${NEWS_FIELDS.author}/EMail`
        ].join(','),
        $expand: NEWS_FIELDS.author,
        $filter: `${NEWS_FIELDS.active} eq 1 and ${NEWS_FIELDS.newsType} eq '${NEWS_TYPE_FILTER_VALUE}'`,
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
