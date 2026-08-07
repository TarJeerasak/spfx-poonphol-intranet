import { useMemo, useState } from 'react';
import { Announcement } from '../../../shared/types/content';
import {
  AnnouncementFilters,
  AnnouncementSortOrder,
  DEFAULT_ANNOUNCEMENT_FILTERS,
  filterAnnouncements,
  getAnnouncementTypeOptions,
  paginateAnnouncements,
  sortAnnouncements
} from '../services/announcementService';
import { useAllAnnouncementsFeed } from './useAllAnnouncementsFeed';

const PAGE_SIZE = 10;

export interface UseAnnouncementListFeedResult {
  items: Announcement[];
  typeOptions: string[];
  filters: AnnouncementFilters;
  sortOrder: AnnouncementSortOrder;
  page: number;
  pageCount: number;
  filteredCount: number;
  isLoading: boolean;
  error: Error | undefined;
  setSearch: (value: string) => void;
  setType: (value: string) => void;
  setSortOrder: (value: AnnouncementSortOrder) => void;
  setPage: (value: number) => void;
}

export function useAnnouncementListFeed(): UseAnnouncementListFeedResult {
  const { items: allAnnouncements, isLoading, error } = useAllAnnouncementsFeed();

  const typeOptions = useMemo(() => getAnnouncementTypeOptions(allAnnouncements), [allAnnouncements]);

  const [filters, setFilters] = useState<AnnouncementFilters>(DEFAULT_ANNOUNCEMENT_FILTERS);
  const [sortOrder, setSortOrder] = useState<AnnouncementSortOrder>('latest');
  const [page, setPage] = useState(1);

  const filteredAndSorted = useMemo(
    () => sortAnnouncements(filterAnnouncements(allAnnouncements, filters), sortOrder),
    [allAnnouncements, filters, sortOrder]
  );

  const { items, pageCount, totalCount, page: currentPage } = useMemo(
    () => paginateAnnouncements(filteredAndSorted, page, PAGE_SIZE),
    [filteredAndSorted, page]
  );

  const updateFilters = (partial: Partial<AnnouncementFilters>): void => {
    setFilters(previous => ({ ...previous, ...partial }));
    setPage(1);
  };

  return {
    items,
    typeOptions,
    filters,
    sortOrder,
    page: currentPage,
    pageCount,
    filteredCount: totalCount,
    isLoading,
    error,
    setSearch: value => updateFilters({ search: value }),
    setType: value => updateFilters({ type: value }),
    setSortOrder: value => {
      setSortOrder(value);
      setPage(1);
    },
    setPage
  };
}
