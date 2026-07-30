import { useEffect, useMemo, useState } from 'react';
import { AppCategory, AppItem } from '../../../shared/types/content';
import { getCurrentUser } from '../../../shared/services/currentUser';
import { AppUsageRecord, buildAppUsageMap, fetchAppUsage, recordAppUsage } from '../services/appUsageService';
import {
  addFavoriteApp,
  buildFavoriteAppMap,
  fetchFavoriteApps,
  FavoriteAppRecord,
  findOldestFavorite,
  MAX_FAVORITE_APPS_PER_USER,
  removeFavoriteApp
} from '../services/favoriteAppsService';
import {
  AppFilters,
  AppTab,
  DEFAULT_APP_FILTERS,
  fetchApps,
  filterApps,
  getAppCategories,
  getAppCompanies,
  sortAppsForTab
} from '../services/moreAppsService';

const INITIAL_VISIBLE_COUNT = 12;

export interface UseMoreAppsFeedResult {
  items: AppItem[];
  categories: AppCategory[];
  companies: string[];
  filteredCount: number;
  filters: AppFilters;
  favoriteIds: ReadonlySet<string>;
  canExpand: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  error: Error | undefined;
  setSearch: (value: string) => void;
  setCompany: (value: string) => void;
  setCategory: (value: string) => void;
  setTab: (value: AppTab) => void;
  toggleFavorite: (appId: string) => void;
  recordUsage: (appId: string) => void;
  toggleExpanded: () => void;
}

export function useMoreAppsFeed(): UseMoreAppsFeedResult {
  const [allApps, setAllApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchApps()
      .then(apps => {
        if (isCancelled) {
          return;
        }
        setAllApps(apps);
        setIsLoading(false);
      })
      .catch((fetchError: Error) => {
        if (isCancelled) {
          return;
        }
        setError(fetchError);
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const [filters, setFilters] = useState<AppFilters>(DEFAULT_APP_FILTERS);
  const [isExpanded, setIsExpanded] = useState(false);

  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [favoriteRecords, setFavoriteRecords] = useState<FavoriteAppRecord[]>([]);
  const [savingAppIds, setSavingAppIds] = useState<Record<string, boolean>>({});
  const [usageRecords, setUsageRecords] = useState<AppUsageRecord[]>([]);

  useEffect(() => {
    let isCancelled = false;

    getCurrentUser()
      .then(user => {
        if (isCancelled) {
          return undefined;
        }
        setCurrentUserEmail(user.email);
        return fetchFavoriteApps(user.email);
      })
      .then(records => {
        if (!isCancelled && records) {
          setFavoriteRecords(records);
        }
      })
      .catch(() => {
        // Leave apps unmarked as favorite if we can't determine the current user's favorites.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getCurrentUser()
      .then(user => fetchAppUsage(user.email))
      .then(records => {
        if (!isCancelled) {
          setUsageRecords(records);
        }
      })
      .catch(() => {
        // Leave apps without usage history if we can't determine the current user's usage.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const favoriteItemIdByAppId = useMemo(() => buildFavoriteAppMap(favoriteRecords), [favoriteRecords]);
  const favoriteIds = useMemo(() => new Set(Object.keys(favoriteItemIdByAppId)), [favoriteItemIdByAppId]);

  const appUsageByAppId = useMemo(() => buildAppUsageMap(usageRecords), [usageRecords]);
  const categories = useMemo(() => getAppCategories(allApps), [allApps]);
  const companies = useMemo(() => getAppCompanies(allApps), [allApps]);

  const appsWithUsage = useMemo(
    () =>
      allApps.map(app => {
        const usage = appUsageByAppId[app.id];
        return usage ? { ...app, usageCount: usage.usageCount, lastUsedAt: usage.lastUsedAt } : app;
      }),
    [allApps, appUsageByAppId]
  );

  const filteredAndSorted = useMemo(
    () => sortAppsForTab(filterApps(appsWithUsage, filters, favoriteIds), filters.tab),
    [appsWithUsage, filters, favoriteIds]
  );

  const items = isExpanded ? filteredAndSorted : filteredAndSorted.slice(0, INITIAL_VISIBLE_COUNT);

  const updateFilters = (partial: Partial<AppFilters>): void => {
    setFilters(previous => ({ ...previous, ...partial }));
    setIsExpanded(false);
  };

  async function toggleFavorite(appId: string): Promise<void> {
    if (!currentUserEmail || savingAppIds[appId]) {
      return;
    }

    setSavingAppIds(current => ({ ...current, [appId]: true }));

    try {
      const existingItemId = favoriteItemIdByAppId[appId];

      if (existingItemId) {
        await removeFavoriteApp(existingItemId);
        setFavoriteRecords(current => current.filter(record => record.Id !== existingItemId));
        return;
      }

      const app = allApps.find(candidate => candidate.id === appId);
      if (!app) {
        return;
      }

      let remainingRecords = favoriteRecords;
      if (remainingRecords.length >= MAX_FAVORITE_APPS_PER_USER) {
        const oldest = findOldestFavorite(remainingRecords);
        if (oldest) {
          await removeFavoriteApp(oldest.Id);
          remainingRecords = remainingRecords.filter(record => record.Id !== oldest.Id);
        }
      }

      const newItemId = await addFavoriteApp(app, currentUserEmail);
      setFavoriteRecords([...remainingRecords, { Id: newItemId, App_ID: Number(appId) }]);
    } finally {
      setSavingAppIds(current => {
        const next = { ...current };
        delete next[appId];
        return next;
      });
    }
  }

  async function recordUsage(appId: string): Promise<void> {
    if (!currentUserEmail) {
      return;
    }

    const app = allApps.find(candidate => candidate.id === appId);
    if (!app) {
      return;
    }

    const result = await recordAppUsage(app, currentUserEmail, new Date().toISOString());

    setUsageRecords(current => [
      ...current.filter(record => record.App_ID !== Number(appId)),
      { Id: result.itemId, App_ID: Number(appId), UsageCount: result.usageCount, LastUsed_Date: result.lastUsedAt }
    ]);
  }

  return {
    items,
    categories,
    companies,
    filteredCount: filteredAndSorted.length,
    filters,
    favoriteIds,
    canExpand: filteredAndSorted.length > INITIAL_VISIBLE_COUNT,
    isExpanded,
    isLoading,
    error,
    setSearch: value => updateFilters({ search: value }),
    setCompany: value => updateFilters({ company: value }),
    setCategory: value => updateFilters({ categoryId: value }),
    setTab: value => updateFilters({ tab: value }),
    toggleFavorite: appId => {
      toggleFavorite(appId).catch(() => {
        // State only updates after a successful request, so a failure leaves favoriteIds untouched.
      });
    },
    recordUsage: appId => {
      recordUsage(appId).catch(() => {
        // Usage tracking is best-effort and must never block opening the app.
      });
    },
    toggleExpanded: () => setIsExpanded(current => !current)
  };
}
