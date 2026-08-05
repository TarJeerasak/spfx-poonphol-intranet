import { fetchRequestDigest, spApi } from '../../../shared/services/api';
import { findKnowledgeCountRecord, upsertKnowledgeCount } from './knowledgeCountService';

const HISTORY_LIST_TITLE = 'History_KM_Read';

// (KM_ID, UserEmail) is the key everywhere this list is read or written - a
// read is recorded at most once per user per KM item.
async function findKnowledgeReadRecord(kmId: string, userEmail: string): Promise<{ Id: number } | undefined> {
  const response = await spApi.get<{ value: Array<{ Id: number }> }>(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id',
      $filter: `KM_ID eq ${Number(kmId)} and UserEmail eq '${userEmail}'`,
      $top: 1
    }
  });

  return response.data.value[0];
}

export async function recordKnowledgeRead(kmId: string, userEmail: string, currentReadCount: number): Promise<number> {
  const existing = await findKnowledgeReadRecord(kmId, userEmail);
  if (existing) {
    return currentReadCount;
  }

  const digest = await fetchRequestDigest();
  const nextReadCount = currentReadCount + 1;
  const countRecord = await findKnowledgeCountRecord(kmId);

  await spApi.post(
    `/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`,
    { UserEmail: userEmail, KM_ID: Number(kmId) },
    { headers: { 'X-RequestDigest': digest } }
  );

  await upsertKnowledgeCount(kmId, digest, countRecord, { readCount: nextReadCount });

  return nextReadCount;
}
