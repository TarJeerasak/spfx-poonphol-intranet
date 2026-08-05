import { spApi } from '../../../shared/services/api';

const COUNT_LIST_TITLE = 'History_KM_Count';

export interface ISPKnowledgeCountItem {
  Id: number;
  KM_ID: number;
  ReadCount?: number;
  LikeCount?: number;
}

export interface KnowledgeCounts {
  readCount: number;
  likeCount: number;
}

export type KnowledgeCountMap = Record<string, KnowledgeCounts>;

export function buildKnowledgeCountMap(items: ISPKnowledgeCountItem[]): KnowledgeCountMap {
  const map: KnowledgeCountMap = {};
  items.forEach(item => {
    map[String(item.KM_ID)] = { readCount: item.ReadCount ?? 0, likeCount: item.LikeCount ?? 0 };
  });
  return map;
}

export async function fetchKnowledgeCountMap(): Promise<KnowledgeCountMap> {
  const response = await spApi.get<{ value: ISPKnowledgeCountItem[] }>(`/lists/getbytitle('${COUNT_LIST_TITLE}')/items`, {
    params: { $select: 'Id,KM_ID,ReadCount,LikeCount', $top: 5000 }
  });

  return buildKnowledgeCountMap(response.data.value);
}

export async function findKnowledgeCountRecord(kmId: string): Promise<ISPKnowledgeCountItem | undefined> {
  const response = await spApi.get<{ value: ISPKnowledgeCountItem[] }>(`/lists/getbytitle('${COUNT_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,KM_ID,ReadCount,LikeCount',
      $filter: `KM_ID eq ${Number(kmId)}`,
      $top: 1
    }
  });

  return response.data.value[0];
}

// Only the fields present in `patch` are written on MERGE, so updating one counter never
// clobbers the other counter already stored on an existing History_KM_Count row.
export async function upsertKnowledgeCount(
  kmId: string,
  digest: string,
  existing: ISPKnowledgeCountItem | undefined,
  patch: Partial<KnowledgeCounts>
): Promise<void> {
  if (existing) {
    const body: Record<string, number> = {};
    if (patch.readCount !== undefined) {
      body.ReadCount = patch.readCount;
    }
    if (patch.likeCount !== undefined) {
      body.LikeCount = patch.likeCount;
    }

    await spApi.post(`/lists/getbytitle('${COUNT_LIST_TITLE}')/items(${existing.Id})`, body, {
      headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*' }
    });
    return;
  }

  await spApi.post(
    `/lists/getbytitle('${COUNT_LIST_TITLE}')/items`,
    { KM_ID: Number(kmId), ReadCount: patch.readCount ?? 0, LikeCount: patch.likeCount ?? 0 },
    { headers: { 'X-RequestDigest': digest } }
  );
}
