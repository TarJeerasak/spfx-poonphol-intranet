import { fetchRequestDigest, spApi } from '../../../shared/services/api';

const APP_USAGE_LIST_TITLE = 'History_App_Usage';

export interface AppUsageRecord {
  Id: number;
  App_ID: number;
  UsageCount: number;
  LastUsed_Date: string;
}

export interface AppUsageEntry {
  itemId: number;
  usageCount: number;
  lastUsedAt: string;
}

export type AppUsageMap = Record<string, AppUsageEntry>;

// The (App_ID, UserEmail) pair is the key everywhere this list is read or written -
// only id/name are needed to record a usage hit, so callers can pass an AppItem or a FavoriteAppLink.
export interface AppUsageTarget {
  id: string;
  name: string;
}

export function buildAppUsageMap(records: AppUsageRecord[]): AppUsageMap {
  const map: AppUsageMap = {};
  records.forEach(record => {
    map[String(record.App_ID)] = { itemId: record.Id, usageCount: record.UsageCount, lastUsedAt: record.LastUsed_Date };
  });
  return map;
}

export async function fetchAppUsage(userEmail: string): Promise<AppUsageRecord[]> {
  const response = await spApi.get<{ value: AppUsageRecord[] }>(`/lists/getbytitle('${APP_USAGE_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,App_ID,UsageCount,LastUsed_Date',
      $filter: `UserEmail eq '${userEmail}'`,
      $top: 5000
    }
  });

  return response.data.value;
}

async function findAppUsage(appId: string, userEmail: string): Promise<{ Id: number; UsageCount: number } | undefined> {
  const response = await spApi.get<{ value: Array<{ Id: number; UsageCount: number }> }>(
    `/lists/getbytitle('${APP_USAGE_LIST_TITLE}')/items`,
    {
      params: {
        $select: 'Id,UsageCount',
        $filter: `App_ID eq ${Number(appId)} and UserEmail eq '${userEmail}'`,
        $top: 1
      }
    }
  );

  return response.data.value[0];
}

export async function recordAppUsage(app: AppUsageTarget, userEmail: string, now: string): Promise<AppUsageEntry> {
  const digest = await fetchRequestDigest();
  const existing = await findAppUsage(app.id, userEmail);

  if (existing) {
    const nextUsageCount = existing.UsageCount + 1;

    await spApi.post(
      `/lists/getbytitle('${APP_USAGE_LIST_TITLE}')/items(${existing.Id})`,
      { UsageCount: nextUsageCount, LastUsed_Date: now },
      { headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*' } }
    );

    return { itemId: existing.Id, usageCount: nextUsageCount, lastUsedAt: now };
  }

  const createResponse = await spApi.post<{ Id: number }>(
    `/lists/getbytitle('${APP_USAGE_LIST_TITLE}')/items`,
    { Title: app.name, App_ID: Number(app.id), UserEmail: userEmail, UsageCount: 1, LastUsed_Date: now },
    { headers: { 'X-RequestDigest': digest } }
  );

  return { itemId: createResponse.data.Id, usageCount: 1, lastUsedAt: now };
}
