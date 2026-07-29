import { spApi } from '../../../shared/services/api';
import { CommunityPost } from '../../../shared/types/content';
import { buildUserPhotoUrl } from '../../../shared/utils/buildUserPhotoUrl';
import { formatRelativeThaiTime } from '../../../shared/utils/formatRelativeThaiTime';
import { IAttachmentFile } from '../../../shared/utils/resolveListItemImageUrl';
import { resolveAttachmentImageUrls } from '../../../shared/utils/resolveAttachmentImageUrls';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { stripHtml } from '../../../shared/utils/stripHtml';

const COMMUNITY_LIST_TITLE = 'Poonphol_Community';
export const MAX_FEATURED_COMMUNITY_POST_COUNT = 3;

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('Poonphol_Community')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
// "Created By" is exposed over REST as the "Author" person field.
const COMMUNITY_FIELDS = {
  id: 'Id',
  description: 'Description',
  likeCount: 'LikeCount',
  created: 'Created',
  author: 'Author',
  active: 'Active'
} as const;

interface ISPCommunityListItem {
  Id: number;
  Description?: string;
  LikeCount?: number;
  Created?: string;
  Author?: {
    Title: string;
    EMail?: string;
    JobTitle?: string;
  };
  AttachmentFiles?: IAttachmentFile[];
  Active: boolean;
}

export interface CommunityFeedResult {
  posts: CommunityPost[];
  totalCount: number;
}

export function mapToCommunityPost(raw: ISPCommunityListItem, now: number): CommunityPost {
  const descriptionHtml = raw.Description ?? '';

  return {
    id: String(raw.Id),
    authorName: raw.Author?.Title ?? '',
    // JobTitle comes from the User Information List entry synced from the user's profile -
    // often empty unless a profile sync has run, but costs nothing extra to try.
    authorRole: raw.Author?.JobTitle ?? '',
    postedAtLabel: raw.Created ? formatRelativeThaiTime(new Date(raw.Created), now) : '',
    authorAvatarUrl: buildUserPhotoUrl(raw.Author?.EMail),
    text: stripHtml(descriptionHtml),
    imageUrls: resolveAttachmentImageUrls(raw.AttachmentFiles),
    likeCount: raw.LikeCount ?? 0
  };
}

export function selectCommunityItemsByClosestCreatedDate(
  activeItems: ISPCommunityListItem[],
  now: number,
  maxCount: number = MAX_FEATURED_COMMUNITY_POST_COUNT
): ISPCommunityListItem[] {
  return selectClosestByDate(activeItems, item => item.Created, now, maxCount);
}

export async function fetchCommunityFeed(): Promise<CommunityFeedResult> {
  const response = await spApi.get<{ value: ISPCommunityListItem[] }>(
    `/lists/getbytitle('${COMMUNITY_LIST_TITLE}')/items`,
    {
      params: {
        $select: [
          COMMUNITY_FIELDS.id,
          COMMUNITY_FIELDS.description,
          COMMUNITY_FIELDS.likeCount,
          COMMUNITY_FIELDS.created,
          `${COMMUNITY_FIELDS.author}/Title`,
          `${COMMUNITY_FIELDS.author}/EMail`,
          `${COMMUNITY_FIELDS.author}/JobTitle`,
          'AttachmentFiles/ServerRelativeUrl',
          COMMUNITY_FIELDS.active
        ].join(','),
        $expand: `${COMMUNITY_FIELDS.author},AttachmentFiles`,
        $filter: `${COMMUNITY_FIELDS.active} eq 1`,
        $top: 5000
      }
    }
  );

  const activeItems = response.data.value;
  const now = Date.now();
  const posts = selectCommunityItemsByClosestCreatedDate(activeItems, now).map(raw => mapToCommunityPost(raw, now));

  return {
    posts,
    totalCount: activeItems.length
  };
}
