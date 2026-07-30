import { fetchRequestDigest, spApi } from '../../../shared/services/api';
import { AppItem, FavoriteAppLink } from '../../../shared/types/content';

const FAVORITE_APPS_LIST_TITLE = 'Favorite_Apps';
export const MAX_FAVORITE_APPS_PER_USER = 3;

export type FavoriteAppMap = Record<string, number>;

export interface FavoriteAppRecord {
  Id: number;
  App_ID: number;
  Title?: string;
  URL?: string;
}

export function buildFavoriteAppMap(records: FavoriteAppRecord[]): FavoriteAppMap {
  const map: FavoriteAppMap = {};
  records.forEach(record => {
    map[String(record.App_ID)] = record.Id;
  });
  return map;
}

export function findOldestFavorite(records: FavoriteAppRecord[]): FavoriteAppRecord | undefined {
  return records.reduce<FavoriteAppRecord | undefined>((oldest, record) => (!oldest || record.Id < oldest.Id ? record : oldest), undefined);
}

export function mapToFavoriteAppLink(record: FavoriteAppRecord): FavoriteAppLink {
  return {
    id: String(record.App_ID),
    name: record.Title ?? '',
    launchUrl: record.URL ?? '#'
  };
}

export async function fetchFavoriteApps(userEmail: string): Promise<FavoriteAppRecord[]> {
  const response = await spApi.get<{ value: FavoriteAppRecord[] }>(`/lists/getbytitle('${FAVORITE_APPS_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,App_ID,Title,URL',
      $filter: `UserEmail eq '${userEmail}'`,
      $orderby: 'Id desc',
      $top: 5000
    }
  });

  return response.data.value;
}

// Color is a required Choice column on this list, but which choice to store for a
// favorited app was left undecided - the create payload intentionally omits it.
export async function addFavoriteApp(app: AppItem, userEmail: string): Promise<number> {
  const digest = await fetchRequestDigest();

  const createResponse = await spApi.post<{ Id: number }>(
    `/lists/getbytitle('${FAVORITE_APPS_LIST_TITLE}')/items`,
    { Title: app.name, URL: app.launchUrl, UserEmail: userEmail, App_ID: Number(app.id) },
    { headers: { 'X-RequestDigest': digest } }
  );

  return createResponse.data.Id;
}

export async function removeFavoriteApp(itemId: number): Promise<void> {
  const digest = await fetchRequestDigest();

  await spApi.post(`/lists/getbytitle('${FAVORITE_APPS_LIST_TITLE}')/items(${itemId})`, undefined, {
    headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'DELETE', 'IF-MATCH': '*' }
  });
}
