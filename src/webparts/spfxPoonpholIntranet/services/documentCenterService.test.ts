import { DocumentItem } from '../../../shared/types/content';
import {
  DEFAULT_DOCUMENT_FILTERS,
  filterDocuments,
  getDocumentCategorySummaries,
  getDocumentCompanies,
  getDocumentDepartments,
  getRecentDocuments,
  isDocumentEffective,
  isWithinDateFilter,
  mapToDocumentItem,
  paginateDocuments,
  resolveDocumentFileType,
  sortDocuments
} from './documentCenterService';

function buildDocument(overrides: Partial<DocumentItem>): DocumentItem {
  return {
    id: 'doc-1',
    name: 'Sample Policy',
    nameThai: 'ตัวอย่างนโยบาย',
    fileType: 'pdf',
    type: 'Policy',
    company: 'Poonphol Group',
    department: 'Digital & Technology',
    lastUpdate: '2025-01-01',
    fileUrl: '#',
    ...overrides
  };
}

describe('resolveDocumentFileType', () => {
  it.each([
    ['/sites/PPG_UAT/Shared Documents/Admin_GA/policy.docx', 'word'],
    ['/sites/PPG_UAT/Shared Documents/Admin_GA/report.xlsx', 'excel'],
    ['/sites/PPG_UAT/Shared Documents/Admin_GA/slides.pptx', 'powerpoint'],
    ['/sites/PPG_UAT/Shared Documents/Admin_GA/manual.pdf', 'pdf'],
    ['/sites/PPG_UAT/Shared Documents/Admin_GA/unknown.xyz', 'pdf']
  ])('maps %s to %s', (fileRef, expected) => {
    expect(resolveDocumentFileType(fileRef)).toEqual(expected);
  });
});

describe('mapToDocumentItem', () => {
  it('maps a Shared Documents library item to the DocumentItem shape used by the UI', () => {
    const raw = {
      Id: 320,
      FileLeafRef: 'it-security-policy.pdf',
      FileRef: '/sites/PPG_UAT/Shared Documents/Admin_GA/it-security-policy.pdf',
      Name_ENG: 'IT Security Policy',
      Name_TH: 'นโยบายความปลอดภัยของแผนก IT',
      DocmentType: 'Policy',
      By_Company: { Title: 'PPC' },
      By_Department: { Title: 'Digital & Technology' },
      OData__ModerationStatus: 'Approved',
      Active: true,
      PublishDate: '2025-08-20T00:00:00',
      EffectiveDate: '2025-06-11T00:00:00'
    };

    expect(mapToDocumentItem(raw)).toEqual({
      id: '320',
      name: 'IT Security Policy',
      nameThai: 'นโยบายความปลอดภัยของแผนก IT',
      fileType: 'pdf',
      type: 'Policy',
      company: 'PPC',
      department: 'Digital & Technology',
      lastUpdate: '2025-08-20T00:00:00',
      fileUrl: '/sites/PPG_UAT/Shared Documents/Admin_GA/it-security-policy.pdf'
    });
  });

  it('falls back to the file name when Name_ENG or Name_TH are empty', () => {
    const raw = {
      Id: 321,
      FileLeafRef: 'onboarding-sop.docx',
      FileRef: '/sites/PPG_UAT/Shared Documents/Admin_GA/onboarding-sop.docx',
      Active: true
    };

    const result = mapToDocumentItem(raw);
    expect(result.name).toEqual('onboarding-sop.docx');
    expect(result.nameThai).toEqual('onboarding-sop.docx');
    expect(result.company).toEqual('');
    expect(result.department).toEqual('');
  });
});

describe('isDocumentEffective', () => {
  const now = new Date(2026, 6, 30).getTime();

  it('is true when Effective Date is in the past', () => {
    expect(isDocumentEffective({ EffectiveDate: '2026-06-11T00:00:00' }, now)).toBe(true);
  });

  it('is false when Effective Date is in the future', () => {
    expect(isDocumentEffective({ EffectiveDate: '2026-08-20T00:00:00' }, now)).toBe(false);
  });

  it('is false when Effective Date is missing', () => {
    expect(isDocumentEffective({}, now)).toBe(false);
  });
});

describe('filterDocuments', () => {
  const documents = [
    buildDocument({ id: 'doc-1', name: 'IT Security Policy', nameThai: 'นโยบายความปลอดภัย', type: 'Policy', department: 'Digital & Technology', company: 'Poonphol Group' }),
    buildDocument({ id: 'doc-2', name: 'Data Privacy Guidelines', nameThai: 'แนวทางการปกป้องข้อมูล', type: 'SOP', department: 'Healthcare & Biotechnology', company: 'Poonphol Trading' })
  ];

  it('returns all documents when filters are left at defaults', () => {
    expect(filterDocuments(documents, DEFAULT_DOCUMENT_FILTERS)).toHaveLength(2);
  });

  it('matches search text against the English name', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, search: 'privacy' });
    expect(result.map(doc => doc.id)).toEqual(['doc-2']);
  });

  it('matches search text against the Thai name', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, search: 'ปลอดภัย' });
    expect(result.map(doc => doc.id)).toEqual(['doc-1']);
  });

  it('filters by department', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, department: 'Healthcare & Biotechnology' });
    expect(result.map(doc => doc.id)).toEqual(['doc-2']);
  });

  it('filters by document type', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, type: 'Policy' });
    expect(result.map(doc => doc.id)).toEqual(['doc-1']);
  });

  it('filters by company', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, company: 'Poonphol Trading' });
    expect(result.map(doc => doc.id)).toEqual(['doc-2']);
  });

  it('combines multiple filters', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, department: 'Digital & Technology', type: 'SOP' });
    expect(result).toHaveLength(0);
  });

  it('filters by Publish Date range', () => {
    const result = filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, dateFrom: '2025-01-01', dateTo: '2025-01-01' });
    expect(result.map(doc => doc.id)).toEqual(['doc-1', 'doc-2']);

    expect(filterDocuments(documents, { ...DEFAULT_DOCUMENT_FILTERS, dateFrom: '2025-02-01' })).toHaveLength(0);
  });
});

describe('isWithinDateFilter', () => {
  it('is true when both bounds are empty', () => {
    expect(isWithinDateFilter('2025-06-01', '', '')).toBe(true);
  });

  it('excludes dates before dateFrom', () => {
    expect(isWithinDateFilter('2025-06-01', '2025-06-02', '')).toBe(false);
    expect(isWithinDateFilter('2025-06-02', '2025-06-02', '')).toBe(true);
  });

  it('excludes dates after dateTo, inclusive of the whole day', () => {
    expect(isWithinDateFilter('2025-06-02T23:59:00', '', '2025-06-02')).toBe(true);
    expect(isWithinDateFilter('2025-06-03T00:00:01', '', '2025-06-02')).toBe(false);
  });

  it('is false for an unparsable date', () => {
    expect(isWithinDateFilter('', '', '')).toBe(false);
  });
});

describe('sortDocuments', () => {
  const documents = [
    buildDocument({ id: 'doc-old', lastUpdate: '2023-01-01' }),
    buildDocument({ id: 'doc-new', lastUpdate: '2025-06-01' }),
    buildDocument({ id: 'doc-mid', lastUpdate: '2024-03-15' })
  ];

  it('orders newest first when order is latest', () => {
    expect(sortDocuments(documents, 'latest').map(doc => doc.id)).toEqual(['doc-new', 'doc-mid', 'doc-old']);
  });

  it('orders oldest first when order is oldest', () => {
    expect(sortDocuments(documents, 'oldest').map(doc => doc.id)).toEqual(['doc-old', 'doc-mid', 'doc-new']);
  });

  it('does not mutate the input array', () => {
    const original = [...documents];
    sortDocuments(documents, 'latest');
    expect(documents).toEqual(original);
  });
});

describe('paginateDocuments', () => {
  const documents = Array.from({ length: 25 }, (_, index) => buildDocument({ id: `doc-${index}` }));

  it('slices the requested page', () => {
    const result = paginateDocuments(documents, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.items[0].id).toEqual('doc-0');
    expect(result.pageCount).toEqual(3);
    expect(result.totalCount).toEqual(25);
  });

  it('returns the remaining items on the last page', () => {
    const result = paginateDocuments(documents, 3, 10);
    expect(result.items).toHaveLength(5);
    expect(result.page).toEqual(3);
  });

  it('clamps a page number above the page count to the last page', () => {
    const result = paginateDocuments(documents, 99, 10);
    expect(result.page).toEqual(3);
  });

  it('clamps a page number below 1 to the first page', () => {
    const result = paginateDocuments(documents, 0, 10);
    expect(result.page).toEqual(1);
  });
});

describe('getDocumentCategorySummaries', () => {
  it('counts documents per top-level category', () => {
    const documents = [
      buildDocument({ id: 'doc-1', type: 'Policy' }),
      buildDocument({ id: 'doc-2', type: 'Policy' }),
      buildDocument({ id: 'doc-3', type: 'SOP' })
    ];

    const summaries = getDocumentCategorySummaries(documents);

    expect(summaries.find(summary => summary.id === 'policy')?.count).toEqual(2);
    expect(summaries.find(summary => summary.id === 'sop')?.count).toEqual(1);
    expect(summaries.find(summary => summary.id === 'form')?.count).toEqual(0);
  });
});

describe('getDocumentCompanies', () => {
  it('returns the distinct companies visible across the given documents', () => {
    const documents = [
      buildDocument({ id: 'doc-1', company: 'Poonphol Co.,Ltd.' }),
      buildDocument({ id: 'doc-2', company: 'Poonphol Co.,Ltd.' }),
      buildDocument({ id: 'doc-3', company: 'Poonphol Trading' })
    ];

    expect(getDocumentCompanies(documents)).toEqual(['Poonphol Co.,Ltd.', 'Poonphol Trading']);
  });

  it('ignores documents with no company set', () => {
    const documents = [buildDocument({ id: 'doc-1', company: '' })];

    expect(getDocumentCompanies(documents)).toEqual([]);
  });
});

describe('getDocumentDepartments', () => {
  it('returns the distinct departments visible across the given documents', () => {
    const documents = [
      buildDocument({ id: 'doc-1', department: 'Digital and Technology' }),
      buildDocument({ id: 'doc-2', department: 'Digital and Technology' }),
      buildDocument({ id: 'doc-3', department: 'Finance' })
    ];

    expect(getDocumentDepartments(documents)).toEqual(['Digital and Technology', 'Finance']);
  });
});

describe('getRecentDocuments', () => {
  const documents = [
    buildDocument({ id: 'doc-old', lastUpdate: '2023-01-01' }),
    buildDocument({ id: 'doc-new', lastUpdate: '2025-06-01' }),
    buildDocument({ id: 'doc-mid', lastUpdate: '2024-03-15' })
  ];

  it('returns the most recently updated documents first', () => {
    expect(getRecentDocuments(documents, 2).map(doc => doc.id)).toEqual(['doc-new', 'doc-mid']);
  });

  it('does not mutate the input array', () => {
    const original = [...documents];
    getRecentDocuments(documents, 2);
    expect(documents).toEqual(original);
  });
});
