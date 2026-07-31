import { useMemo, useState } from 'react';
import { CompanyPhoneEntry, InternalExtensionEntry } from '../../../shared/types/content';
import {
  COMPANY_PHONE_DIRECTORY,
  CompanyDirectoryFilters,
  DEFAULT_COMPANY_DIRECTORY_FILTERS,
  DEFAULT_EXTENSION_DIRECTORY_FILTERS,
  ExtensionDirectoryFilters,
  INTERNAL_EXTENSION_DIRECTORY,
  filterCompanyDirectory,
  filterExtensionDirectory,
  getCompanyOptions,
  getDepartmentOptions,
  getLocationOptions,
  paginateEntries
} from '../services/telephoneListService';

const PAGE_SIZE = 10;

export interface UseTelephoneListFeedResult {
  companyOptions: string[];
  companyFilters: CompanyDirectoryFilters;
  companyEntries: CompanyPhoneEntry[];
  companyPage: number;
  companyPageCount: number;
  companyTotalCount: number;
  setCompanySearch: (value: string) => void;
  setCompanyFilter: (value: string) => void;
  setCompanyPage: (value: number) => void;

  departmentOptions: string[];
  locationOptions: string[];
  extensionFilters: ExtensionDirectoryFilters;
  extensionEntries: InternalExtensionEntry[];
  extensionPage: number;
  extensionPageCount: number;
  extensionTotalCount: number;
  setExtensionSearch: (value: string) => void;
  setExtensionDepartment: (value: string) => void;
  setExtensionLocation: (value: string) => void;
  setExtensionPage: (value: number) => void;
}

export function useTelephoneListFeed(): UseTelephoneListFeedResult {
  const companyOptions = useMemo(() => getCompanyOptions(COMPANY_PHONE_DIRECTORY), []);
  const [companyFilters, setCompanyFilters] = useState<CompanyDirectoryFilters>(DEFAULT_COMPANY_DIRECTORY_FILTERS);
  const [companyPage, setCompanyPage] = useState(1);

  const filteredCompanyEntries = useMemo(
    () => filterCompanyDirectory(COMPANY_PHONE_DIRECTORY, companyFilters),
    [companyFilters]
  );
  const companyResult = useMemo(
    () => paginateEntries(filteredCompanyEntries, companyPage, PAGE_SIZE),
    [filteredCompanyEntries, companyPage]
  );

  const departmentOptions = useMemo(() => getDepartmentOptions(INTERNAL_EXTENSION_DIRECTORY), []);
  const locationOptions = useMemo(() => getLocationOptions(INTERNAL_EXTENSION_DIRECTORY), []);
  const [extensionFilters, setExtensionFilters] = useState<ExtensionDirectoryFilters>(DEFAULT_EXTENSION_DIRECTORY_FILTERS);
  const [extensionPage, setExtensionPage] = useState(1);

  const filteredExtensionEntries = useMemo(
    () => filterExtensionDirectory(INTERNAL_EXTENSION_DIRECTORY, extensionFilters),
    [extensionFilters]
  );
  const extensionResult = useMemo(
    () => paginateEntries(filteredExtensionEntries, extensionPage, PAGE_SIZE),
    [filteredExtensionEntries, extensionPage]
  );

  return {
    companyOptions,
    companyFilters,
    companyEntries: companyResult.items,
    companyPage: companyResult.page,
    companyPageCount: companyResult.pageCount,
    companyTotalCount: companyResult.totalCount,
    setCompanySearch: value => {
      setCompanyFilters(previous => ({ ...previous, search: value }));
      setCompanyPage(1);
    },
    setCompanyFilter: value => {
      setCompanyFilters(previous => ({ ...previous, company: value }));
      setCompanyPage(1);
    },
    setCompanyPage,

    departmentOptions,
    locationOptions,
    extensionFilters,
    extensionEntries: extensionResult.items,
    extensionPage: extensionResult.page,
    extensionPageCount: extensionResult.pageCount,
    extensionTotalCount: extensionResult.totalCount,
    setExtensionSearch: value => {
      setExtensionFilters(previous => ({ ...previous, search: value }));
      setExtensionPage(1);
    },
    setExtensionDepartment: value => {
      setExtensionFilters(previous => ({ ...previous, department: value }));
      setExtensionPage(1);
    },
    setExtensionLocation: value => {
      setExtensionFilters(previous => ({ ...previous, location: value }));
      setExtensionPage(1);
    },
    setExtensionPage
  };
}
