import { spApi } from '../../../shared/services/api';
import { SiteURL } from '../../../shared/config/site';
import { KnowledgeAttachment, KnowledgeCategory, KnowledgeItem } from '../../../shared/types/content';
import { parseMultiChoiceValue } from '../../../shared/utils/parseMultiChoiceValue';
import { buildAttachmentUrl, isReservedAttachment, resolveImageColumnUrl } from '../../../shared/utils/resolveImageColumnUrl';
import { IAttachmentFile } from '../../../shared/utils/resolveListItemImageUrl';
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
// "Author" collides with the display name of the list's built-in Created By field (whose real
// internal name is "Author"), so SharePoint auto-suffixed this custom column's internal name to
// "Author0" - confirmed via the column's Edit Column page. It's a plain "Single line of text"
// column (not a Person field), so it's read directly with no $expand.
const KNOWLEDGE_FIELDS = {
  id: 'Id',
  title: 'Title',
  shortDescription: 'ShortDescription',
  description: 'Description',
  tag: 'Tag',
  thumbnailImage: 'ThumbnailImage',
  publishDate: 'PublishDate',
  category: 'Category',
  author: 'Author0',
  isRecommended: 'IsRecommended',
  active: 'Active',
  created: 'Created',
  modified: 'Modified'
} as const;

interface ISPKnowledgeListItem {
  Id: number;
  Title: string;
  ShortDescription?: string;
  Description?: string;
  Tag?: string[] | string;
  ThumbnailImage?: string;
  AttachmentFiles?: IAttachmentFile[];
  PublishDate?: string;
  Category?: string;
  Author0?: string;
  IsRecommended?: boolean;
  Active: boolean;
  Created?: string;
  Modified?: string;
}

export interface KnowledgeFeedResult {
  items: KnowledgeItem[];
  // Editorially curated via IsRecommended - powers "บทเรียนแนะนำ" on the Knowledge page.
  featuredItems: KnowledgeItem[];
  // Most recently published, regardless of IsRecommended - powers the home page's KM widget.
  latestItems: KnowledgeItem[];
  categories: KnowledgeCategory[];
  totalCount: number;
}

function getAttachmentFileName(file: IAttachmentFile): string {
  return file.ServerRelativeUrl.split('/').pop() ?? file.ServerRelativeUrl;
}

export function buildKnowledgeAttachments(attachmentFiles: IAttachmentFile[] | undefined): KnowledgeAttachment[] {
  if (!attachmentFiles) {
    return [];
  }

  return attachmentFiles
    .filter(file => !isReservedAttachment(file))
    .map(file => {
      const name = getAttachmentFileName(file);
      const fileType = name.split('.').pop()?.toUpperCase() ?? '';

      return { name, url: buildAttachmentUrl(file), serverRelativeUrl: file.ServerRelativeUrl, fileType };
    });
}

// Read/like counts live in the History_KM_Count list (keyed by KM_ID), not on this list -
// `counts` comes from that lookup and defaults to zero when an item has no count record yet.
export function mapToKnowledgeItem(raw: ISPKnowledgeListItem, counts?: KnowledgeCounts): KnowledgeItem {
  return {
    id: String(raw.Id),
    categoryId: raw.Category ?? '',
    tags: parseMultiChoiceValue(raw.Tag),
    title: raw.Title,
    authorName: raw.Author0 ?? '',
    shortDescription: raw.ShortDescription ?? '',
    description: raw.Description ?? '',
    imageUrl: resolveImageColumnUrl(raw.ThumbnailImage, raw.AttachmentFiles),
    readCount: counts?.readCount ?? 0,
    likeCount: counts?.likeCount ?? 0,
    isRecommended: !!raw.IsRecommended,
    attachments: buildKnowledgeAttachments(raw.AttachmentFiles),
    createdAt: raw.Created ?? '',
    modifiedAt: raw.Modified ?? ''
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

// "บทเรียนแนะนำ" (featured lessons) is an editorial choice, not an automatic heuristic - only
// items explicitly checked IsRecommended in the list are eligible.
export function filterRecommendedKnowledgeItems(items: ISPKnowledgeListItem[]): ISPKnowledgeListItem[] {
  return items.filter(item => !!item.IsRecommended);
}

export async function fetchKnowledgeFeed(): Promise<KnowledgeFeedResult> {
  const listTitle = resolveKnowledgeListTitle(SiteURL);
  const [response, countMap] = await Promise.all([
    spApi.get<{ value: ISPKnowledgeListItem[] }>(`/lists/getbytitle('${listTitle}')/items`, {
      params: {
        $select: [
          KNOWLEDGE_FIELDS.id,
          KNOWLEDGE_FIELDS.title,
          KNOWLEDGE_FIELDS.shortDescription,
          KNOWLEDGE_FIELDS.description,
          KNOWLEDGE_FIELDS.tag,
          KNOWLEDGE_FIELDS.thumbnailImage,
          'AttachmentFiles/ServerRelativeUrl',
          KNOWLEDGE_FIELDS.publishDate,
          KNOWLEDGE_FIELDS.category,
          KNOWLEDGE_FIELDS.author,
          KNOWLEDGE_FIELDS.isRecommended,
          KNOWLEDGE_FIELDS.active,
          KNOWLEDGE_FIELDS.created,
          KNOWLEDGE_FIELDS.modified
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
  const recommendedItems = filterRecommendedKnowledgeItems(activeItems);
  const featuredItems = selectKnowledgeItemsByClosestPublishDate(recommendedItems, Date.now()).map(item =>
    mapToKnowledgeItem(item, countMap[String(item.Id)])
  );
  const latestItems = selectKnowledgeItemsByClosestPublishDate(activeItems, Date.now()).map(item =>
    mapToKnowledgeItem(item, countMap[String(item.Id)])
  );

  return {
    items,
    featuredItems,
    latestItems,
    categories: buildKnowledgeCategories(items),
    totalCount: activeItems.length
  };
}
