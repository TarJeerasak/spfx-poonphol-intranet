import { spApi } from '../../../shared/services/api';
import { SiteURL } from '../../../shared/config/site';
import { KnowledgeCategory, KnowledgeItem } from '../../../shared/types/content';
import { parseMultiChoiceValue } from '../../../shared/utils/parseMultiChoiceValue';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { IAttachmentFile, resolveListItemImageUrl } from '../../../shared/utils/resolveListItemImageUrl';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { fetchKnowledgeCountMap, KnowledgeCounts } from './knowledgeCountService';

const KNOWLEDGE_LIST_TITLE = 'KnowledgeManagementList';
const KNOWLEDGE_LIST_TITLE_UAT = 'KnowledgeManagementList1';
const UAT_SITE_URL = 'https://poonphol.sharepoint.com/sites/PPG_UAT';
export const MAX_FEATURED_KNOWLEDGE_COUNT = 3;
const ALL_CATEGORY_ID = 'all';
const ALL_CATEGORY_LABEL = 'ดูทั้งหมด';

export function resolveKnowledgeListTitle(siteUrl: string): string {
  return siteUrl === UAT_SITE_URL ? KNOWLEDGE_LIST_TITLE_UAT : KNOWLEDGE_LIST_TITLE;
}

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('KnowledgeManagementList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
const KNOWLEDGE_FIELDS = {
  id: 'Id',
  title: 'Title',
  tag: 'Tag',
  thumbnailImage: 'ThumbnailImage',
  publishDate: 'PublishDate',
  category: 'Category',
  active: 'Active'
} as const;

interface ISPKnowledgeListItem {
  Id: number;
  Title: string;
  Tag?: string[] | string;
  ThumbnailImage?: string;
  AttachmentFiles?: IAttachmentFile[];
  PublishDate?: string;
  Category?: string;
  Active: boolean;
}

export interface KnowledgeFeedResult {
  items: KnowledgeItem[];
  featuredItems: KnowledgeItem[];
  categories: KnowledgeCategory[];
  totalCount: number;
}

// Read/like counts live in the History_KM_Count list (keyed by KM_ID), not on this list -
// `counts` comes from that lookup and defaults to zero when an item has no count record yet.
export function mapToKnowledgeItem(raw: ISPKnowledgeListItem, counts?: KnowledgeCounts): KnowledgeItem {
  return {
    id: String(raw.Id),
    categoryId: raw.Category ?? '',
    tags: parseMultiChoiceValue(raw.Tag),
    title: raw.Title,
    imageUrl: resolveListItemImageUrl(parseThumbnailImage(raw.ThumbnailImage), raw.AttachmentFiles),
    readCount: counts?.readCount ?? 0,
    likeCount: counts?.likeCount ?? 0
  };
}

export function buildKnowledgeCategories(items: KnowledgeItem[]): KnowledgeCategory[] {
  const uniqueCategoryIds = Array.from(new Set(items.map(item => item.categoryId).filter(Boolean)));

  return [
    { id: ALL_CATEGORY_ID, label: ALL_CATEGORY_LABEL },
    ...uniqueCategoryIds.map(categoryId => ({ id: categoryId, label: categoryId }))
  ];
}

export function selectKnowledgeItemsByClosestPublishDate(
  activeItems: ISPKnowledgeListItem[],
  now: number,
  maxCount: number = MAX_FEATURED_KNOWLEDGE_COUNT
): ISPKnowledgeListItem[] {
  return selectClosestByDate(activeItems, item => item.PublishDate, now, maxCount);
}

export async function fetchKnowledgeFeed(): Promise<KnowledgeFeedResult> {
  const listTitle = resolveKnowledgeListTitle(SiteURL);
  const [response, countMap] = await Promise.all([
    spApi.get<{ value: ISPKnowledgeListItem[] }>(`/lists/getbytitle('${listTitle}')/items`, {
      params: {
        $select: [
          KNOWLEDGE_FIELDS.id,
          KNOWLEDGE_FIELDS.title,
          KNOWLEDGE_FIELDS.tag,
          KNOWLEDGE_FIELDS.thumbnailImage,
          'AttachmentFiles/ServerRelativeUrl',
          KNOWLEDGE_FIELDS.publishDate,
          KNOWLEDGE_FIELDS.category,
          KNOWLEDGE_FIELDS.active
        ].join(','),
        $expand: 'AttachmentFiles',
        $filter: `${KNOWLEDGE_FIELDS.active} eq 1`,
        $top: 5000
      }
    }),
    fetchKnowledgeCountMap()
  ]);

  const activeItems = response.data.value;
  const items = activeItems.map(item => mapToKnowledgeItem(item, countMap[String(item.Id)]));
  const featuredItems = selectKnowledgeItemsByClosestPublishDate(activeItems, Date.now()).map(item =>
    mapToKnowledgeItem(item, countMap[String(item.Id)])
  );

  return {
    items,
    featuredItems,
    categories: buildKnowledgeCategories(items),
    totalCount: activeItems.length
  };
}
