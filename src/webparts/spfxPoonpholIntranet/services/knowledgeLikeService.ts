import { fetchRequestDigest, spApi } from '../../../shared/services/api';
import { findKnowledgeCountRecord, upsertKnowledgeCount } from './knowledgeCountService';

const HISTORY_LIST_TITLE = 'History_KM_Like';

export type LikedKnowledgeMap = Record<string, number>;

interface ISPKnowledgeLikeHistoryItem {
  Id: number;
  KM_ID: number;
}

export function buildLikedKnowledgeMap(items: ISPKnowledgeLikeHistoryItem[]): LikedKnowledgeMap {
  const map: LikedKnowledgeMap = {};
  items.forEach(item => {
    map[String(item.KM_ID)] = item.Id;
  });
  return map;
}

export async function fetchLikedKnowledgeMap(userEmail: string): Promise<LikedKnowledgeMap> {
  const response = await spApi.get<{ value: ISPKnowledgeLikeHistoryItem[] }>(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,KM_ID',
      $filter: `UserEmail eq '${userEmail}'`,
      $top: 5000
    }
  });

  return buildLikedKnowledgeMap(response.data.value);
}

export async function likeKnowledgeItem(kmId: string, userEmail: string, currentLikeCount: number): Promise<number> {
  const digest = await fetchRequestDigest();
  const nextLikeCount = currentLikeCount + 1;
  const countRecord = await findKnowledgeCountRecord(kmId);

  const createResponse = await spApi.post<{ Id: number }>(
    `/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`,
    { UserEmail: userEmail, KM_ID: Number(kmId) },
    { headers: { 'X-RequestDigest': digest } }
  );

  await upsertKnowledgeCount(kmId, digest, countRecord, { likeCount: nextLikeCount });

  return createResponse.data.Id;
}

export async function unlikeKnowledgeItem(historyItemId: number, kmId: string, currentLikeCount: number): Promise<void> {
  const digest = await fetchRequestDigest();
  const nextLikeCount = Math.max(0, currentLikeCount - 1);
  const countRecord = await findKnowledgeCountRecord(kmId);

  await spApi.post(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items(${historyItemId})`, undefined, {
    headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'DELETE', 'IF-MATCH': '*' }
  });

  await upsertKnowledgeCount(kmId, digest, countRecord, { likeCount: nextLikeCount });
}
