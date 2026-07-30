import { useEffect, useMemo, useState } from 'react';
import { DocumentCategorySummary, DocumentItem } from '../../../shared/types/content';
import {
  DEFAULT_DOCUMENT_FILTERS,
  DocumentFilters,
  DocumentSortOrder,
  fetchDocuments,
  filterDocuments,
  getDocumentCategorySummaries,
  getDocumentCompanies,
  getDocumentDepartments,
  getRecentDocuments,
  paginateDocuments,
  sortDocuments
} from '../services/documentCenterService';

const PAGE_SIZE = 10;
const RECENT_DOCUMENTS_COUNT = 5;

export interface UseDocumentCenterFeedResult {
  categorySummaries: DocumentCategorySummary[];
  recentDocuments: DocumentItem[];
  companies: string[];
  departments: string[];
  items: DocumentItem[];
  filters: DocumentFilters;
  sortOrder: DocumentSortOrder;
  page: number;
  pageCount: number;
  filteredCount: number;
  isLoading: boolean;
  error: Error | undefined;
  setSearch: (value: string) => void;
  setCompany: (value: string) => void;
  setDepartment: (value: string) => void;
  setType: (value: string) => void;
  setDateRange: (dateFrom: string, dateTo: string) => void;
  setSortOrder: (value: DocumentSortOrder) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
}

export function useDocumentCenterFeed(): UseDocumentCenterFeedResult {
  const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchDocuments()
      .then(documents => {
        if (isCancelled) {
          return;
        }
        setAllDocuments(documents);
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

  const categorySummaries = useMemo(() => getDocumentCategorySummaries(allDocuments), [allDocuments]);
  const recentDocuments = useMemo(() => getRecentDocuments(allDocuments, RECENT_DOCUMENTS_COUNT), [allDocuments]);
  const companies = useMemo(() => getDocumentCompanies(allDocuments), [allDocuments]);
  const departments = useMemo(() => getDocumentDepartments(allDocuments), [allDocuments]);

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
    recentDocuments,
    companies,
    departments,
    items,
    filters,
    sortOrder,
    page: currentPage,
    pageCount,
    filteredCount: totalCount,
    isLoading,
    error,
    setSearch: value => updateFilters({ search: value }),
    setCompany: value => updateFilters({ company: value }),
    setDepartment: value => updateFilters({ department: value }),
    setType: value => updateFilters({ type: value }),
    setDateRange: (dateFrom, dateTo) => updateFilters({ dateFrom, dateTo }),
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
