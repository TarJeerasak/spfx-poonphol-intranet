import { useMemo, useState } from 'react';
import { AppItem } from '../../../shared/types/content';
import {
  AppFilters,
  AppTab,
  DEFAULT_APP_FILTERS,
  fetchApps,
  filterApps,
  INITIAL_FAVORITE_APP_IDS,
  sortAppsForTab
} from '../services/moreAppsService';

const INITIAL_VISIBLE_COUNT = 12;

export interface UseMoreAppsFeedResult {
  items: AppItem[];
  filteredCount: number;
  filters: AppFilters;
  favoriteIds: ReadonlySet<string>;
  canExpand: boolean;
  isExpanded: boolean;
  setSearch: (value: string) => void;
  setCompany: (value: string) => void;
  setCategory: (value: string) => void;
  setTab: (value: AppTab) => void;
  toggleFavorite: (appId: string) => void;
  toggleExpanded: () => void;
}

export function useMoreAppsFeed(): UseMoreAppsFeedResult {
  const allApps = useMemo(() => fetchApps(), []);

  const [filters, setFilters] = useState<AppFilters>(DEFAULT_APP_FILTERS);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set(INITIAL_FAVORITE_APP_IDS));
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredAndSorted = useMemo(
    () => sortAppsForTab(filterApps(allApps, filters, favoriteIds), filters.tab),
    [allApps, filters, favoriteIds]
  );

  const items = isExpanded ? filteredAndSorted : filteredAndSorted.slice(0, INITIAL_VISIBLE_COUNT);

  const updateFilters = (partial: Partial<AppFilters>): void => {
    setFilters(previous => ({ ...previous, ...partial }));
    setIsExpanded(false);
  };

  return {
    items,
    filteredCount: filteredAndSorted.length,
    filters,
    favoriteIds,
    canExpand: filteredAndSorted.length > INITIAL_VISIBLE_COUNT,
    isExpanded,
    setSearch: value => updateFilters({ search: value }),
    setCompany: value => updateFilters({ company: value }),
    setCategory: value => updateFilters({ categoryId: value }),
    setTab: value => updateFilters({ tab: value }),
    toggleFavorite: appId => {
      setFavoriteIds(current => {
        const next = new Set(current);
        if (next.has(appId)) {
          next.delete(appId);
        } else {
          next.add(appId);
        }
        return next;
      });
    },
    toggleExpanded: () => setIsExpanded(current => !current)
  };
}
