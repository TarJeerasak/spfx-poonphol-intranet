import { CompanyPhoneEntry, InternalExtensionEntry } from '../../../shared/types/content';
import {
  DEFAULT_COMPANY_DIRECTORY_FILTERS,
  DEFAULT_EXTENSION_DIRECTORY_FILTERS,
  buildCompanyDirectoryCsv,
  buildExtensionDirectoryCsv,
  filterCompanyDirectory,
  filterExtensionDirectory,
  getCompanyOptions,
  getDepartmentOptions,
  getLocationOptions,
  mapToCompanyPhoneEntry,
  mapToInternalExtensionEntry,
  paginateEntries
} from './telephoneListService';

function buildCompanyEntry(overrides: Partial<CompanyPhoneEntry>): CompanyPhoneEntry {
  return {
    id: 'cp-1',
    company: 'บริษัท พูลผล จำกัด',
    branch: '',
    phoneNumber: '02 233 3990',
    extension: '-',
    ...overrides
  };
}

function buildExtensionEntry(overrides: Partial<InternalExtensionEntry>): InternalExtensionEntry {
  return {
    id: 'ext-1',
    contactName: 'คุณสมจิตต์ (พี่ส้ม)',
    department: 'ฝ่ายจัดการ',
    location: 'ชั้น 18',
    deskNumber: '2100',
    ...overrides
  };
}

describe('mapToCompanyPhoneEntry', () => {
  it('maps a Master_CompanyTelephone item to the CompanyPhoneEntry shape used by the UI', () => {
    const raw = {
      Id: 4,
      CompanyName: 'บริษัท สิทธินันท์ จำกัด',
      ShortDescription: 'สิทธินันท์ ปทุมธานี',
      TelephoneNumber: '02 598 3300-9',
      ExtensionNumber: '-',
      Active: true
    };

    expect(mapToCompanyPhoneEntry(raw)).toEqual({
      id: '4',
      company: 'บริษัท สิทธินันท์ จำกัด',
      branch: 'สิทธินันท์ ปทุมธานี',
      phoneNumber: '02 598 3300-9',
      extension: '-'
    });
  });

  it('falls back to empty strings when optional fields are missing', () => {
    const raw = { Id: 1, Active: true };

    expect(mapToCompanyPhoneEntry(raw)).toEqual({
      id: '1',
      company: '',
      branch: '',
      phoneNumber: '',
      extension: ''
    });
  });
});

describe('mapToInternalExtensionEntry', () => {
  it('maps a Master_InternalTelephone item to the InternalExtensionEntry shape used by the UI', () => {
    const raw = {
      Id: 1,
      ContactName: 'คุณสมจิตต์ (พี่ส้ม)',
      DepartmentName: 'ฝ่ายจัดการ',
      LocationName: 'ชั้น 18',
      ExtensionNumber: '2100',
      Active: true
    };

    expect(mapToInternalExtensionEntry(raw)).toEqual({
      id: '1',
      contactName: 'คุณสมจิตต์ (พี่ส้ม)',
      department: 'ฝ่ายจัดการ',
      location: 'ชั้น 18',
      deskNumber: '2100'
    });
  });

  it('falls back to empty strings when optional fields are missing', () => {
    const raw = { Id: 9, Active: true };

    expect(mapToInternalExtensionEntry(raw)).toEqual({
      id: '9',
      contactName: '',
      department: '',
      location: '',
      deskNumber: ''
    });
  });
});

describe('filterCompanyDirectory', () => {
  const entries = [
    buildCompanyEntry({ id: 'cp-1', company: 'บริษัท พูลผล จำกัด', phoneNumber: '02 233 3990' }),
    buildCompanyEntry({ id: 'cp-2', company: 'บริษัท สิทธินันท์ จำกัด', branch: 'สิทธินันท์ ปทุมธานี', phoneNumber: '02 598 3300-9' })
  ];

  it('returns all entries when filters are left at defaults', () => {
    expect(filterCompanyDirectory(entries, DEFAULT_COMPANY_DIRECTORY_FILTERS)).toHaveLength(2);
  });

  it('matches search text against the company name', () => {
    const result = filterCompanyDirectory(entries, { ...DEFAULT_COMPANY_DIRECTORY_FILTERS, search: 'สิทธินันท์' });
    expect(result.map(entry => entry.id)).toEqual(['cp-2']);
  });

  it('matches search text against the phone number', () => {
    const result = filterCompanyDirectory(entries, { ...DEFAULT_COMPANY_DIRECTORY_FILTERS, search: '598 3300' });
    expect(result.map(entry => entry.id)).toEqual(['cp-2']);
  });

  it('filters by company', () => {
    const result = filterCompanyDirectory(entries, { ...DEFAULT_COMPANY_DIRECTORY_FILTERS, company: 'บริษัท พูลผล จำกัด' });
    expect(result.map(entry => entry.id)).toEqual(['cp-1']);
  });
});

describe('filterExtensionDirectory', () => {
  const entries = [
    buildExtensionEntry({ id: 'ext-1', contactName: 'คุณสมจิตต์ (พี่ส้ม)', department: 'ฝ่ายจัดการ', location: 'ชั้น 18', deskNumber: '2100' }),
    buildExtensionEntry({ id: 'ext-2', contactName: 'ดาริน (หยุน)', department: 'การเงิน', location: 'ชั้น 20', deskNumber: '2204' })
  ];

  it('returns all entries when filters are left at defaults', () => {
    expect(filterExtensionDirectory(entries, DEFAULT_EXTENSION_DIRECTORY_FILTERS)).toHaveLength(2);
  });

  it('matches search text against the contact name', () => {
    const result = filterExtensionDirectory(entries, { ...DEFAULT_EXTENSION_DIRECTORY_FILTERS, search: 'ดาริน' });
    expect(result.map(entry => entry.id)).toEqual(['ext-2']);
  });

  it('matches search text against the desk number', () => {
    const result = filterExtensionDirectory(entries, { ...DEFAULT_EXTENSION_DIRECTORY_FILTERS, search: '2204' });
    expect(result.map(entry => entry.id)).toEqual(['ext-2']);
  });

  it('filters by department', () => {
    const result = filterExtensionDirectory(entries, { ...DEFAULT_EXTENSION_DIRECTORY_FILTERS, department: 'การเงิน' });
    expect(result.map(entry => entry.id)).toEqual(['ext-2']);
  });

  it('filters by location', () => {
    const result = filterExtensionDirectory(entries, { ...DEFAULT_EXTENSION_DIRECTORY_FILTERS, location: 'ชั้น 18' });
    expect(result.map(entry => entry.id)).toEqual(['ext-1']);
  });

  it('combines multiple filters', () => {
    const result = filterExtensionDirectory(entries, { ...DEFAULT_EXTENSION_DIRECTORY_FILTERS, department: 'การเงิน', location: 'ชั้น 18' });
    expect(result).toHaveLength(0);
  });
});

describe('paginateEntries', () => {
  const entries = Array.from({ length: 25 }, (_, index) => buildExtensionEntry({ id: `ext-${index}` }));

  it('slices the requested page', () => {
    const result = paginateEntries(entries, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.items[0].id).toEqual('ext-0');
    expect(result.pageCount).toEqual(3);
    expect(result.totalCount).toEqual(25);
  });

  it('returns the remaining items on the last page', () => {
    const result = paginateEntries(entries, 3, 10);
    expect(result.items).toHaveLength(5);
    expect(result.page).toEqual(3);
  });

  it('clamps a page number above the page count to the last page', () => {
    expect(paginateEntries(entries, 99, 10).page).toEqual(3);
  });

  it('clamps a page number below 1 to the first page', () => {
    expect(paginateEntries(entries, 0, 10).page).toEqual(1);
  });
});

describe('getCompanyOptions / getDepartmentOptions / getLocationOptions', () => {
  it('returns distinct, non-empty company names', () => {
    const entries = [
      buildCompanyEntry({ id: 'cp-1', company: 'บริษัท พูลผล จำกัด' }),
      buildCompanyEntry({ id: 'cp-2', company: 'บริษัท พูลผล จำกัด' }),
      buildCompanyEntry({ id: 'cp-3', company: 'บริษัท สิทธินันท์ จำกัด' })
    ];

    expect(getCompanyOptions(entries)).toEqual(['บริษัท พูลผล จำกัด', 'บริษัท สิทธินันท์ จำกัด']);
  });

  it('returns distinct department and location values', () => {
    const entries = [
      buildExtensionEntry({ id: 'ext-1', department: 'ฝ่ายจัดการ', location: 'ชั้น 18' }),
      buildExtensionEntry({ id: 'ext-2', department: 'ฝ่ายจัดการ', location: 'ชั้น 20' }),
      buildExtensionEntry({ id: 'ext-3', department: 'การเงิน', location: 'ชั้น 18' })
    ];

    expect(getDepartmentOptions(entries)).toEqual(['ฝ่ายจัดการ', 'การเงิน']);
    expect(getLocationOptions(entries)).toEqual(['ชั้น 18', 'ชั้น 20']);
  });
});

describe('buildCompanyDirectoryCsv', () => {
  it('renders a header row plus one row per entry, quoting values', () => {
    const csv = buildCompanyDirectoryCsv([buildCompanyEntry({ company: 'บริษัท "พูลผล" จำกัด', phoneNumber: '02 233 3990' })]);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toEqual('"บริษัท","สาขา","เบอร์โทรศัพท์","ต่อ"');
    expect(lines[1]).toContain('"บริษัท ""พูลผล"" จำกัด"');
    expect(lines[1]).toContain('"02 233 3990"');
  });
});

describe('buildExtensionDirectoryCsv', () => {
  it('renders a header row plus one row per entry', () => {
    const csv = buildExtensionDirectoryCsv([buildExtensionEntry({ contactName: 'ดาริน (หยุน)', deskNumber: '2204' })]);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toEqual('"แผนก","สถานที่","เบอร์ภายในหรือโต๊ะทำงาน"');
    expect(lines[1]).toContain('"ดาริน (หยุน)"');
    expect(lines[1]).toContain('"2204"');
  });
});
