import { fetchRequestDigest, spApi } from '../../../shared/services/api';

const HISTORY_LIST_TITLE = 'History_Community_Like';
const COMMUNITY_LIST_TITLE = 'Poonphol_Community';

export type LikedPostMap = Record<string, number>;

interface ISPLikeHistoryItem {
  Id: number;
  Post_ID: number;
}

export function buildLikedPostMap(items: ISPLikeHistoryItem[]): LikedPostMap {
  const map: LikedPostMap = {};
  items.forEach(item => {
    map[String(item.Post_ID)] = item.Id;
  });
  return map;
}

export async function fetchLikedPostMap(userEmail: string): Promise<LikedPostMap> {
  const response = await spApi.get<{ value: ISPLikeHistoryItem[] }>(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,Post_ID',
      $filter: `UserEmail eq '${userEmail}'`,
      $top: 5000
    }
  });

  return buildLikedPostMap(response.data.value);
}

export async function likePost(postId: number, userEmail: string, currentLikeCount: number): Promise<number> {
  const digest = await fetchRequestDigest();

  const createResponse = await spApi.post<{ Id: number }>(
    `/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`,
    { UserEmail: userEmail, Post_ID: postId },
    { headers: { 'X-RequestDigest': digest } }
  );

  await spApi.post(
    `/lists/getbytitle('${COMMUNITY_LIST_TITLE}')/items(${postId})`,
    { LikeCount: currentLikeCount + 1 },
    { headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*' } }
  );

  return createResponse.data.Id;
}

export async function unlikePost(historyItemId: number, postId: number, currentLikeCount: number): Promise<void> {
  const digest = await fetchRequestDigest();

  await spApi.post(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items(${historyItemId})`, undefined, {
    headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'DELETE', 'IF-MATCH': '*' }
  });

  await spApi.post(
    `/lists/getbytitle('${COMMUNITY_LIST_TITLE}')/items(${postId})`,
    { LikeCount: Math.max(0, currentLikeCount - 1) },
    { headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*' } }
  );
}
