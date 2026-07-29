import { useMemo, useState } from 'react';
import { DocumentCategorySummary, DocumentItem } from '../../../shared/types/content';
import {
  DEFAULT_DOCUMENT_FILTERS,
  DocumentFilters,
  DocumentSortOrder,
  fetchDocuments,
  filterDocuments,
  getDocumentCategorySummaries,
  paginateDocuments,
  sortDocuments
} from '../services/documentCenterService';

const PAGE_SIZE = 10;

export interface UseDocumentCenterFeedResult {
  categorySummaries: DocumentCategorySummary[];
  items: DocumentItem[];
  filters: DocumentFilters;
  sortOrder: DocumentSortOrder;
  page: number;
  pageCount: number;
  filteredCount: number;
  setSearch: (value: string) => void;
  setCompany: (value: string) => void;
  setDepartment: (value: string) => void;
  setType: (value: string) => void;
  setSortOrder: (value: DocumentSortOrder) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
}

export function useDocumentCenterFeed(): UseDocumentCenterFeedResult {
  const allDocuments = useMemo(() => fetchDocuments(), []);
  const categorySummaries = useMemo(() => getDocumentCategorySummaries(allDocuments), [allDocuments]);

  const [filters, setFilters] = useState<DocumentFilters>(DEFAULT_DOCUMENT_FILTERS);
  const [sortOrder, setSortOrder] = useState<DocumentSortOrder>('latest');
  const [page, setPage] = useState(1);

  const filteredAndSorted = useMemo(
    () => sortDocuments(filterDocuments(allDocuments, filters), sortOrder),
    [allDocuments, filters, sortOrder]
  );

  const { items, pageCount, totalCount, page: currentPage } = useMemo(
    () => paginateDocuments(filteredAndSorted, page, PAGE_SIZE),
    [filteredAndSorted, page]
  );

  const updateFilters = (partial: Partial<DocumentFilters>): void => {
    setFilters(previous => ({ ...previous, ...partial }));
    setPage(1);
  };

  return {
    categorySummaries,
    items,
    filters,
    sortOrder,
    page: currentPage,
    pageCount,
    filteredCount: totalCount,
    setSearch: value => updateFilters({ search: value }),
    setCompany: value => updateFilters({ company: value }),
    setDepartment: value => updateFilters({ department: value }),
    setType: value => updateFilters({ type: value }),
    setSortOrder: value => {
      setSortOrder(value);
      setPage(1);
    },
    setPage,
    clearFilters: () => {
      setFilters(DEFAULT_DOCUMENT_FILTERS);
      setSortOrder('latest');
      setPage(1);
    }
  };
}
