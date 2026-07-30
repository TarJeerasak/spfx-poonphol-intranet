import { SitePath } from '../../../shared/config/site';
import { spApi } from '../../../shared/services/api';
import { DocumentCategorySummary, DocumentFileType, DocumentItem, DocumentTypeTag } from '../../../shared/types/content';
import { parseIsoDate } from '../../../shared/utils/isoDate';

export const DOCUMENT_TYPES: DocumentTypeTag[] = ['Policy', 'SOP', 'Form', 'Manual', 'Announcement', 'Report', 'Template'];

const DOCUMENT_LIBRARY_SERVER_RELATIVE_URL = `${SitePath}/Shared Documents`;
const APPROVED_STATUS_VALUE = 'Approved';

// Internal names guessed from the library's display names - verify against
// `${SiteURL}/_api/web/GetList('${DOCUMENT_LIBRARY_SERVER_RELATIVE_URL}')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
// By_Company/By_Department are Lookup fields - Title is the default shown value on the source list.
// Approval Status is the library's built-in content-approval status, not a custom column - its
// internal name starts with an underscore (`_ModerationStatus`), which REST exposes prefixed as
// `OData__ModerationStatus`.
const DOCUMENT_FIELDS = {
  id: 'Id',
  fileLeafRef: 'FileLeafRef',
  fileRef: 'FileRef',
  nameEnglish: 'Name_ENG',
  nameThai: 'Name_TH',
  documentType: 'DocmentType',
  byCompany: 'By_Company',
  byDepartment: 'By_Department',
  moderationStatus: 'OData__ModerationStatus',
  active: 'Active',
  publishDate: 'PublishDate',
  effectiveDate: 'EffectiveDate'
} as const;

interface ISPDocumentLibraryItem {
  Id: number;
  FileLeafRef: string;
  FileRef: string;
  Name_ENG?: string;
  Name_TH?: string;
  DocmentType?: string;
  By_Company?: { Title?: string };
  By_Department?: { Title?: string };
  OData__ModerationStatus?: string;
  Active: boolean;
  PublishDate?: string;
  EffectiveDate?: string;
}

export function resolveDocumentFileType(fileRef: string): DocumentFileType {
  const extension = fileRef.split('.').pop()?.toLowerCase() ?? '';

  if (extension === 'doc' || extension === 'docx') {
    return 'word';
  }
  if (extension === 'xls' || extension === 'xlsx') {
    return 'excel';
  }
  if (extension === 'ppt' || extension === 'pptx') {
    return 'powerpoint';
  }
  return 'pdf';
}

export function mapToDocumentItem(raw: ISPDocumentLibraryItem): DocumentItem {
  return {
    id: String(raw.Id),
    name: raw.Name_ENG || raw.FileLeafRef,
    nameThai: raw.Name_TH || raw.FileLeafRef,
    fileType: resolveDocumentFileType(raw.FileRef),
    type: (raw.DocmentType ?? '') as DocumentTypeTag,
    company: raw.By_Company?.Title ?? '',
    department: raw.By_Department?.Title ?? '',
    lastUpdate: raw.PublishDate ?? '',
    fileUrl: raw.FileRef
  };
}

export function isDocumentEffective(raw: Pick<ISPDocumentLibraryItem, 'EffectiveDate'>, now: number): boolean {
  return !!raw.EffectiveDate && new Date(raw.EffectiveDate).getTime() < now;
}

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const response = await spApi.get<{ value: ISPDocumentLibraryItem[] }>(
    `/GetList('${DOCUMENT_LIBRARY_SERVER_RELATIVE_URL}')/items`,
    {
      params: {
        $select: [
          DOCUMENT_FIELDS.id,
          DOCUMENT_FIELDS.fileLeafRef,
          DOCUMENT_FIELDS.fileRef,
          DOCUMENT_FIELDS.nameEnglish,
          DOCUMENT_FIELDS.nameThai,
          DOCUMENT_FIELDS.documentType,
          `${DOCUMENT_FIELDS.byCompany}/Title`,
          `${DOCUMENT_FIELDS.byDepartment}/Title`,
          DOCUMENT_FIELDS.moderationStatus,
          DOCUMENT_FIELDS.active,
          DOCUMENT_FIELDS.publishDate,
          DOCUMENT_FIELDS.effectiveDate
        ].join(','),
        $expand: [DOCUMENT_FIELDS.byCompany, DOCUMENT_FIELDS.byDepartment].join(','),
        $filter: `${DOCUMENT_FIELDS.active} eq 1 and ${DOCUMENT_FIELDS.moderationStatus} eq '${APPROVED_STATUS_VALUE}'`,
        $top: 5000
      }
    }
  );

  const now = Date.now();
  return response.data.value.filter(item => isDocumentEffective(item, now)).map(mapToDocumentItem);
}

const CATEGORY_DEFINITIONS: Array<{ id: string; type: DocumentTypeTag; label: string; labelThai: string }> = [
  { id: 'policy', type: 'Policy', label: 'Policy', labelThai: 'นโยบายบริษัท' },
  { id: 'sop', type: 'SOP', label: 'SOP', labelThai: 'ขั้นตอนการปฏิบัติงาน' },
  { id: 'form', type: 'Form', label: 'Form', labelThai: 'แบบฟอร์มต่างๆ' },
  { id: 'announcement', type: 'Announcement', label: 'Announcement', labelThai: 'ประกาศบริษัท' },
  { id: 'manual', type: 'Manual', label: 'Manual', labelThai: 'คู่มือการใช้งาน' }
];

export function getDocumentCategorySummaries(documents: DocumentItem[]): DocumentCategorySummary[] {
  return CATEGORY_DEFINITIONS.map(definition => ({
    id: definition.id,
    type: definition.type,
    label: definition.label,
    labelThai: definition.labelThai,
    count: documents.filter(doc => doc.type === definition.type).length
  }));
}

export function getDocumentCompanies(documents: DocumentItem[]): string[] {
  return Array.from(new Set(documents.map(doc => doc.company).filter(Boolean)));
}

export function getDocumentDepartments(documents: DocumentItem[]): string[] {
  return Array.from(new Set(documents.map(doc => doc.department).filter(Boolean)));
}

export function getRecentDocuments(documents: DocumentItem[], count: number): DocumentItem[] {
  return [...documents]
    .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
    .slice(0, count);
}

export interface DocumentFilters {
  search: string;
  company: string;
  department: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_DOCUMENT_FILTERS: DocumentFilters = {
  search: '',
  company: 'All',
  department: 'All',
  type: 'All',
  dateFrom: '',
  dateTo: ''
};

export function isWithinDateFilter(lastUpdate: string, dateFrom: string, dateTo: string): boolean {
  const updated = new Date(lastUpdate).getTime();
  if (Number.isNaN(updated)) {
    return false;
  }

  const from = parseIsoDate(dateFrom);
  if (from && updated < from.getTime()) {
    return false;
  }

  const to = parseIsoDate(dateTo);
  if (to) {
    to.setHours(23, 59, 59, 999);
    if (updated > to.getTime()) {
      return false;
    }
  }

  return true;
}

export function filterDocuments(documents: DocumentItem[], filters: DocumentFilters): DocumentItem[] {
  const search = filters.search.trim().toLowerCase();

  return documents.filter(doc => {
    const matchesSearch = search.length === 0 || doc.name.toLowerCase().includes(search) || doc.nameThai.includes(search);
    const matchesCompany = filters.company === 'All' || doc.company === filters.company;
    const matchesDepartment = filters.department === 'All' || doc.department === filters.department;
    const matchesType = filters.type === 'All' || doc.type === filters.type;
    const matchesDate = isWithinDateFilter(doc.lastUpdate, filters.dateFrom, filters.dateTo);

    return matchesSearch && matchesCompany && matchesDepartment && matchesType && matchesDate;
  });
}

export type DocumentSortOrder = 'latest' | 'oldest';

export function sortDocuments(documents: DocumentItem[], order: DocumentSortOrder): DocumentItem[] {
  const sorted = [...documents].sort((a, b) => new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime());
  return order === 'latest' ? sorted.reverse() : sorted;
}

export interface PaginatedDocuments {
  items: DocumentItem[];
  page: number;
  pageCount: number;
  totalCount: number;
}

export function paginateDocuments(documents: DocumentItem[], page: number, pageSize: number): PaginatedDocuments {
  const totalCount = documents.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    items: documents.slice(start, start + pageSize),
    page: safePage,
    pageCount,
    totalCount
  };
}
