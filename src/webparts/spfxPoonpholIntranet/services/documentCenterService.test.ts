import { DocumentItem } from '../../../shared/types/content';
import {
  DEFAULT_DOCUMENT_FILTERS,
  filterDocuments,
  getDocumentCategorySummaries,
  paginateDocuments,
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
