import { CompanyPhoneEntry, InternalExtensionEntry } from '../../../shared/types/content';

export const COMPANY_PHONE_DIRECTORY: CompanyPhoneEntry[] = [
  {
    id: 'cp-1',
    company: 'บริษัท พูลผล จำกัด',
    branch: '',
    phoneNumber: '02 233 3990',
    extension: '-',
    location: 'อาคาร A ชั้น 1',
    note: 'เริ่มทำงานตั้งแต่เวลา 08:00 น.'
  },
  {
    id: 'cp-2',
    company: 'บริษัท ธนากรผลิตภัณฑ์น้ำมันพืช จำกัด',
    branch: '',
    phoneNumber: '02 819 7470',
    extension: '-',
    location: 'อาคาร A ชั้น 2',
    note: 'ติดต่อได้เฉพาะช่วง 12:00-13:00 น. เท่านั้น ช่วงเวลาอื่น อาจติดสายกับลูกค้า'
  },
  {
    id: 'cp-3',
    company: 'บริษัท สิทธินันท์ จำกัด',
    branch: '',
    phoneNumber: '02 233 3990',
    extension: '-',
    location: 'อาคาร A ชั้น 3',
    note: '-'
  },
  {
    id: 'cp-4',
    company: 'บริษัท สิทธินันท์ จำกัด',
    branch: 'สิทธินันท์ ปทุมธานี',
    phoneNumber: '02 598 3300-9',
    extension: '-',
    location: 'อาคาร A ชั้น 3',
    note: '-'
  },
  {
    id: 'cp-5',
    company: 'กลุ่มบริษัทเอส เอ็ม เอส',
    branch: '',
    phoneNumber: '02 598 1123',
    extension: '-',
    location: 'อาคาร B ชั้น 1',
    note: '-'
  },
  {
    id: 'cp-6',
    company: 'กลุ่มบริษัทเอส เอ็ม เอส',
    branch: 'SMS ปทุมธานี',
    phoneNumber: '02 598 1123',
    extension: '-',
    location: 'อาคาร B ชั้น 2',
    note: '-'
  },
  {
    id: 'cp-7',
    company: 'กลุ่มบริษัทเอส เอ็ม เอส',
    branch: 'SMS บุรีรัมย์',
    phoneNumber: '044 815 555',
    extension: '-',
    location: 'อาคาร B ชั้น 3',
    note: '-'
  },
  {
    id: 'cp-8',
    company: 'กลุ่มบริษัทเอส เอ็ม เอส',
    branch: 'SQS ชัยภูมิ',
    phoneNumber: '044 815 588',
    extension: '-',
    location: 'อาคาร B ชั้น 4',
    note: '-'
  },
  {
    id: 'cp-9',
    company: 'บริษัท ซี.อี.เอส. จำกัด',
    branch: '',
    phoneNumber: '02 636 7788',
    extension: '-',
    location: 'อาคาร B ชั้น 5',
    note: '-'
  },
  {
    id: 'cp-10',
    company: 'บริษัท รังสิตพลาซ่า จำกัด',
    branch: '',
    phoneNumber: '02 958 0011',
    extension: '-',
    location: 'อาคาร B ชั้น 6',
    note: '-'
  }
];

export const INTERNAL_EXTENSION_DIRECTORY: InternalExtensionEntry[] = [
  { id: 'ext-1', contactName: 'คุณสมจิตต์ (พี่ส้ม)', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2100', phoneNumber: '02-001-1000, 02-001-1001, 02-001-1002' },
  { id: 'ext-2', contactName: 'คุณวิทยากรณ์ (พี่ตู่)', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2101', phoneNumber: '02-001-1100' },
  { id: 'ext-3', contactName: 'วิมล (นุ้ย)', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2103', phoneNumber: '02-001-1200' },
  { id: 'ext-4', contactName: 'Pantry', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2110', phoneNumber: '02-001-1300' },
  { id: 'ext-5', contactName: 'ห้องประชุม 1', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2111', phoneNumber: '02-001-1400' },
  { id: 'ext-6', contactName: 'ห้องประชุม 2', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2112', phoneNumber: '02-001-1500' },
  { id: 'ext-7', contactName: 'ห้องประชุม 3', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2114', phoneNumber: '02-001-1600' },
  { id: 'ext-8', contactName: 'ดาริน (หยุน)', department: 'การเงิน', location: 'ชั้น 18', deskNumber: '2204', phoneNumber: '02-001-1700' },
  { id: 'ext-9', contactName: 'นิสา (ตุ๊กตา)', department: 'การเงิน', location: 'ชั้น 18', deskNumber: '2200', phoneNumber: '02-001-1800' },
  { id: 'ext-10', contactName: 'ปริยานุช(ขวัญ)', department: 'การเงิน', location: 'ชั้น 18', deskNumber: '2201', phoneNumber: '02-001-1900' }
];

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
      entry.phoneNumber.toLowerCase().includes(search) ||
      entry.note.toLowerCase().includes(search);
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
      search.length === 0 ||
      entry.contactName.toLowerCase().includes(search) ||
      entry.deskNumber.toLowerCase().includes(search) ||
      entry.phoneNumber.toLowerCase().includes(search);
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
  const header = toCsvRow(['บริษัท', 'สาขา', 'เบอร์โทรศัพท์', 'ต่อ', 'สถานที่', 'หมายเหตุ']);
  const rows = entries.map(entry => toCsvRow([entry.company, entry.branch, entry.phoneNumber, entry.extension, entry.location, entry.note]));
  return [header, ...rows].join('\r\n');
}

export function buildExtensionDirectoryCsv(entries: InternalExtensionEntry[]): string {
  const header = toCsvRow(['แผนก', 'สถานที่', 'เบอร์ภายในหรือโต๊ะทำงาน', 'เบอร์โทรศัพท์']);
  const rows = entries.map(entry => toCsvRow([entry.contactName, entry.location, entry.deskNumber, entry.phoneNumber]));
  return [header, ...rows].join('\r\n');
}
