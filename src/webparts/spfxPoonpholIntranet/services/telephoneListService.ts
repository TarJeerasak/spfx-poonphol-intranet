import { spApi } from '../../../shared/services/api';
import { CompanyPhoneEntry, InternalExtensionEntry } from '../../../shared/types/content';

const COMPANY_LIST_TITLE = 'Master_CompanyTelephone';
const INTERNAL_LIST_TITLE = 'Master_InternalTelephone';
const ACTIVE_FILTER_VALUE = 1;

// Internal names guessed from the lists' display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('Master_CompanyTelephone')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// (swap the list title for Master_InternalTelephone as needed) and adjust the constants
// below if a request returns a "field does not exist" error.
const COMPANY_FIELDS = {
  id: 'Id',
  companyName: 'CompanyName',
  shortDescription: 'ShortDescription',
  telephoneNumber: 'TelephoneNumber',
  extensionNumber: 'ExtensionNumber',
  active: 'Active'
} as const;

const INTERNAL_FIELDS = {
  id: 'Id',
  contactName: 'ContactName',
  departmentName: 'DepartmentName',
  locationName: 'LocationName',
  extensionNumber: 'ExtensionNumber',
  active: 'Active'
} as const;

interface ISPCompanyTelephoneItem {
  Id: number;
  CompanyName?: string;
  ShortDescription?: string;
  TelephoneNumber?: string;
  ExtensionNumber?: string;
  Active: boolean;
}

interface ISPInternalTelephoneItem {
  Id: number;
  ContactName?: string;
  DepartmentName?: string;
  LocationName?: string;
  ExtensionNumber?: string;
  Active: boolean;
}

export function mapToCompanyPhoneEntry(raw: ISPCompanyTelephoneItem): CompanyPhoneEntry {
  return {
    id: String(raw.Id),
    company: raw.CompanyName ?? '',
    branch: raw.ShortDescription ?? '',
    phoneNumber: raw.TelephoneNumber ?? '',
    extension: raw.ExtensionNumber ?? ''
  };
}

export function mapToInternalExtensionEntry(raw: ISPInternalTelephoneItem): InternalExtensionEntry {
  return {
    id: String(raw.Id),
    contactName: raw.ContactName ?? '',
    department: raw.DepartmentName ?? '',
    location: raw.LocationName ?? '',
    deskNumber: raw.ExtensionNumber ?? ''
  };
}

export async function fetchCompanyPhoneDirectory(): Promise<CompanyPhoneEntry[]> {
  const response = await spApi.get<{ value: ISPCompanyTelephoneItem[] }>(`/lists/getbytitle('${COMPANY_LIST_TITLE}')/items`, {
    params: {
      $select: [
        COMPANY_FIELDS.id,
        COMPANY_FIELDS.companyName,
        COMPANY_FIELDS.shortDescription,
        COMPANY_FIELDS.telephoneNumber,
        COMPANY_FIELDS.extensionNumber,
        COMPANY_FIELDS.active
      ].join(','),
      $filter: `${COMPANY_FIELDS.active} eq ${ACTIVE_FILTER_VALUE}`,
      $top: 5000
    }
  });

  return response.data.value.map(mapToCompanyPhoneEntry);
}

export async function fetchInternalExtensionDirectory(): Promise<InternalExtensionEntry[]> {
  const response = await spApi.get<{ value: ISPInternalTelephoneItem[] }>(`/lists/getbytitle('${INTERNAL_LIST_TITLE}')/items`, {
    params: {
      $select: [
        INTERNAL_FIELDS.id,
        INTERNAL_FIELDS.contactName,
        INTERNAL_FIELDS.departmentName,
        INTERNAL_FIELDS.locationName,
        INTERNAL_FIELDS.extensionNumber,
        INTERNAL_FIELDS.active
      ].join(','),
      $filter: `${INTERNAL_FIELDS.active} eq ${ACTIVE_FILTER_VALUE}`,
      $top: 5000
    }
  });

  return response.data.value.map(mapToInternalExtensionEntry);
}

export function getCompanyOptions(entries: CompanyPhoneEntry[]): string[] {
  return Array.from(new Set(entries.map(entry => entry.company).filter(Boolean)));
}

export function getDepartmentOptions(entries: InternalExtensionEntry[]): string[] {
  return Array.from(new Set(entries.map(entry => entry.department).filter(Boolean)));
}

export function getLocationOptions(entries: InternalExtensionEntry[]): string[] {
  return Array.from(new Set(entries.map(entry => entry.location).filter(Boolean)));
}

export interface CompanyDirectoryFilters {
  search: string;
  company: string;
}

export const DEFAULT_COMPANY_DIRECTORY_FILTERS: CompanyDirectoryFilters = { search: '', company: 'All' };

export function filterCompanyDirectory(entries: CompanyPhoneEntry[], filters: CompanyDirectoryFilters): CompanyPhoneEntry[] {
  const search = filters.search.trim().toLowerCase();

  return entries.filter(entry => {
    const matchesSearch =
      search.length === 0 ||
      entry.company.toLowerCase().includes(search) ||
      entry.branch.toLowerCase().includes(search) ||
      entry.phoneNumber.toLowerCase().includes(search);
    const matchesCompany = filters.company === 'All' || entry.company === filters.company;

    return matchesSearch && matchesCompany;
  });
}

export interface ExtensionDirectoryFilters {
  search: string;
  department: string;
  location: string;
}

export const DEFAULT_EXTENSION_DIRECTORY_FILTERS: ExtensionDirectoryFilters = { search: '', department: 'All', location: 'All' };

export function filterExtensionDirectory(entries: InternalExtensionEntry[], filters: ExtensionDirectoryFilters): InternalExtensionEntry[] {
  const search = filters.search.trim().toLowerCase();

  return entries.filter(entry => {
    const matchesSearch =
      search.length === 0 || entry.contactName.toLowerCase().includes(search) || entry.deskNumber.toLowerCase().includes(search);
    const matchesDepartment = filters.department === 'All' || entry.department === filters.department;
    const matchesLocation = filters.location === 'All' || entry.location === filters.location;

    return matchesSearch && matchesDepartment && matchesLocation;
  });
}

export interface PaginatedEntries<T> {
  items: T[];
  page: number;
  pageCount: number;
  totalCount: number;
}

export function paginateEntries<T>(entries: T[], page: number, pageSize: number): PaginatedEntries<T> {
  const totalCount = entries.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    items: entries.slice(start, start + pageSize),
    page: safePage,
    pageCount,
    totalCount
  };
}

function toCsvRow(values: string[]): string {
  return values.map(value => `"${value.replace(/"/g, '""')}"`).join(',');
}

export function buildCompanyDirectoryCsv(entries: CompanyPhoneEntry[]): string {
  const header = toCsvRow(['บริษัท', 'สาขา', 'เบอร์โทรศัพท์', 'ต่อ']);
  const rows = entries.map(entry => toCsvRow([entry.company, entry.branch, entry.phoneNumber, entry.extension]));
  return [header, ...rows].join('\r\n');
}

export function buildExtensionDirectoryCsv(entries: InternalExtensionEntry[]): string {
  const header = toCsvRow(['แผนก', 'สถานที่', 'เบอร์ภายในหรือโต๊ะทำงาน']);
  const rows = entries.map(entry => toCsvRow([entry.contactName, entry.location, entry.deskNumber]));
  return [header, ...rows].join('\r\n');
}
