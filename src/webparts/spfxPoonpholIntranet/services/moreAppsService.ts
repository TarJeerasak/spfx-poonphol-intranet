import { spApi } from '../../../shared/services/api';
import { AppCategory, AppCategoryId, AppItem } from '../../../shared/types/content';
import { stripHtml } from '../../../shared/utils/stripHtml';

const APP_LIST_TITLE = 'Inter-ApplList';
const ACTIVE_FILTER_VALUE = 1;

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('Inter-ApplList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
// Department/Company are Lookup fields - Title is the default shown value on the source list.
const APP_FIELDS = {
  id: 'Id',
  title: 'Title',
  description: 'Description',
  url: 'URL',
  department: 'Department',
  company: 'Company',
  active: 'Active',
  created: 'Created'
} as const;

interface ISPAppListItem {
  Id: number;
  Title: string;
  Description?: string;
  URL?: string;
  Department?: { Title?: string };
  Company?: { Title?: string };
  Active: boolean;
  Created?: string;
}

const NEW_APP_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isRecentlyCreated(created: string | undefined, now: Date): boolean {
  if (!created) {
    return false;
  }

  const daysSinceCreated = (now.getTime() - new Date(created).getTime()) / MS_PER_DAY;
  return daysSinceCreated >= 0 && daysSinceCreated <= NEW_APP_WINDOW_DAYS;
}

const CATEGORY_COLOR_PALETTE: Array<{ backgroundColor: string; textColor: string }> = [
  { backgroundColor: '#dff7e5', textColor: '#00582a' },
  { backgroundColor: '#fff2d6', textColor: '#946b00' },
  { backgroundColor: '#e8b5ff', textColor: '#4b0869' },
  { backgroundColor: '#dbebfc', textColor: '#1a57db' },
  { backgroundColor: '#ffedd6', textColor: '#c2400d' },
  { backgroundColor: '#fdffc9', textColor: '#57590f' }
];

const DEFAULT_CATEGORY_COLOR = { backgroundColor: '#e5e7eb', textColor: '#374151' };

// usageCount/lastUsedAt are per-user and come from the History_App_Usage list
// (see appUsageService/useMoreAppsFeed) - they default to unused here.
export function mapToAppItem(raw: ISPAppListItem, now: Date): AppItem {
  return {
    id: String(raw.Id),
    name: raw.Title,
    descriptionThai: raw.Description ? stripHtml(raw.Description) : '',
    categoryId: raw.Department?.Title ?? '',
    company: raw.Company?.Title ?? '',
    usageCount: 0,
    isNew: isRecentlyCreated(raw.Created, now),
    lastUsedAt: '',
    launchUrl: raw.URL ?? '#'
  };
}

export async function fetchApps(): Promise<AppItem[]> {
  const response = await spApi.get<{ value: ISPAppListItem[] }>(`/lists/getbytitle('${APP_LIST_TITLE}')/items`, {
    params: {
      $select: [
        APP_FIELDS.id,
        APP_FIELDS.title,
        APP_FIELDS.description,
        APP_FIELDS.url,
        `${APP_FIELDS.department}/Title`,
        `${APP_FIELDS.company}/Title`,
        APP_FIELDS.active,
        APP_FIELDS.created
      ].join(','),
      $expand: [APP_FIELDS.department, APP_FIELDS.company].join(','),
      $filter: `${APP_FIELDS.active} eq ${ACTIVE_FILTER_VALUE}`,
      $top: 5000
    }
  });

  const now = new Date();
  return response.data.value.map(item => mapToAppItem(item, now));
}

export function getAppCategories(apps: AppItem[]): AppCategory[] {
  const uniqueCategoryIds = Array.from(new Set(apps.map(app => app.categoryId).filter(Boolean)));

  return uniqueCategoryIds.map((categoryId, index) => ({
    id: categoryId,
    label: categoryId,
    ...CATEGORY_COLOR_PALETTE[index % CATEGORY_COLOR_PALETTE.length]
  }));
}

export function getAppCompanies(apps: AppItem[]): string[] {
  return Array.from(new Set(apps.map(app => app.company).filter(Boolean)));
}

export function getAppCategory(categories: AppCategory[], categoryId: AppCategoryId): AppCategory {
  return (
    categories.find(category => category.id === categoryId) ?? {
      id: categoryId,
      label: categoryId,
      ...DEFAULT_CATEGORY_COLOR
    }
  );
}

export type AppTab = 'all' | 'favorites' | 'recent' | 'frequent' | 'new';

export interface AppFilters {
  search: string;
  company: string;
  categoryId: string;
  tab: AppTab;
}

export const DEFAULT_APP_FILTERS: AppFilters = {
  search: '',
  company: 'All',
  categoryId: 'All',
  tab: 'all'
};

export function filterApps(apps: AppItem[], filters: AppFilters, favoriteIds: ReadonlySet<string>): AppItem[] {
  const search = filters.search.trim().toLowerCase();

  return apps.filter(app => {
    const matchesSearch = search.length === 0 || app.name.toLowerCase().includes(search) || app.descriptionThai.includes(search);
    const matchesCompany = filters.company === 'All' || app.company === filters.company;
    const matchesCategory = filters.categoryId === 'All' || app.categoryId === filters.categoryId;
    const matchesTab = filters.tab !== 'favorites' || favoriteIds.has(app.id);

    return matchesSearch && matchesCompany && matchesCategory && matchesTab;
  });
}

export function sortAppsForTab(apps: AppItem[], tab: AppTab): AppItem[] {
  if (tab === 'recent') {
    return apps.filter(app => !!app.lastUsedAt).sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime());
  }
  if (tab === 'frequent') {
    return apps.filter(app => app.usageCount > 0).sort((a, b) => b.usageCount - a.usageCount);
  }
  if (tab === 'new') {
    return apps.filter(app => app.isNew);
  }
  return apps;
}
