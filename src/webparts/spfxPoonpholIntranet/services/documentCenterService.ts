import { DocumentCategorySummary, DocumentItem, DocumentTypeTag } from '../../../shared/types/content';

export const DOCUMENT_COMPANIES = ['Poonphol Group', 'Poonphol Trading', 'Poonphol Logistics', 'Poonphol Digital'];

export const DOCUMENT_DEPARTMENTS = [
  'Digital & Technology',
  'Healthcare & Biotechnology',
  'Sustainable Energy',
  'E-commerce & Retail',
  'Finance & Fintech',
  'Education & e-Learning',
  'Travel & Hospitality',
  'Telecommunications & Networking',
  'Entertainment & Media',
  'Real Estate & Proptech'
];

export const DOCUMENT_TYPES: DocumentTypeTag[] = ['Policy', 'SOP', 'Form', 'Manual', 'Announcement', 'Report', 'Template'];

const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: 'doc-1', name: 'IT Security Policy', nameThai: 'นโยบายความปลอดภัยของแผนก IT', fileType: 'word', type: 'Policy', company: 'Poonphol Group', department: 'Digital & Technology', lastUpdate: '2025-05-01', fileUrl: '#' },
  { id: 'doc-2', name: 'Data Privacy Guidelines', nameThai: 'แนวทางการปกป้องข้อมูลส่วนบุคคล', fileType: 'excel', type: 'SOP', company: 'Poonphol Trading', department: 'Healthcare & Biotechnology', lastUpdate: '2025-04-15', fileUrl: '#' },
  { id: 'doc-3', name: 'Network Access Control', nameThai: 'การควบคุมการเข้าถึงเครือข่าย', fileType: 'powerpoint', type: 'Form', company: 'Poonphol Logistics', department: 'Sustainable Energy', lastUpdate: '2025-03-30', fileUrl: '#' },
  { id: 'doc-4', name: 'Incident Response Plan', nameThai: 'แผนตอบสนองต่อเหตุการณ์', fileType: 'pdf', type: 'Manual', company: 'Poonphol Digital', department: 'E-commerce & Retail', lastUpdate: '2025-02-20', fileUrl: '#' },
  { id: 'doc-5', name: 'User Authentication Standards', nameThai: 'มาตรฐานการระบุตัวตนผู้ใช้', fileType: 'word', type: 'Announcement', company: 'Poonphol Group', department: 'Finance & Fintech', lastUpdate: '2025-01-05', fileUrl: '#' },
  { id: 'doc-6', name: 'Software Update Policy', nameThai: 'นโยบายการอัปเดตซอฟต์แวร์', fileType: 'excel', type: 'Report', company: 'Poonphol Trading', department: 'Education & e-Learning', lastUpdate: '2024-12-10', fileUrl: '#' },
  { id: 'doc-7', name: 'Device Security Protocols', nameThai: 'โปรโตคอลความปลอดภัยของอุปกรณ์', fileType: 'pdf', type: 'Template', company: 'Poonphol Logistics', department: 'Travel & Hospitality', lastUpdate: '2024-11-25', fileUrl: '#' },
  { id: 'doc-8', name: 'Remote Work Security Guidelines', nameThai: 'แนวทางความปลอดภัยสำหรับการทำงานจากระยะไกล', fileType: 'pdf', type: 'Announcement', company: 'Poonphol Digital', department: 'Telecommunications & Networking', lastUpdate: '2024-10-12', fileUrl: '#' },
  { id: 'doc-9', name: 'Access Control Policies', nameThai: 'นโยบายการควบคุมการเข้าถึง', fileType: 'pdf', type: 'Report', company: 'Poonphol Group', department: 'Entertainment & Media', lastUpdate: '2024-09-28', fileUrl: '#' },
  { id: 'doc-10', name: 'Data Encryption Standards', nameThai: 'มาตรฐานการเข้ารหัสข้อมูล', fileType: 'pdf', type: 'Template', company: 'Poonphol Trading', department: 'Real Estate & Proptech', lastUpdate: '2024-08-14', fileUrl: '#' },
  { id: 'doc-11', name: 'Password Management Policy', nameThai: 'นโยบายการจัดการรหัสผ่าน', fileType: 'word', type: 'Policy', company: 'Poonphol Logistics', department: 'Digital & Technology', lastUpdate: '2024-07-22', fileUrl: '#' },
  { id: 'doc-12', name: 'Vendor Onboarding SOP', nameThai: 'ขั้นตอนการรับผู้ขายรายใหม่', fileType: 'excel', type: 'SOP', company: 'Poonphol Digital', department: 'Finance & Fintech', lastUpdate: '2024-06-18', fileUrl: '#' },
  { id: 'doc-13', name: 'Leave Request Form', nameThai: 'แบบฟอร์มขอลางาน', fileType: 'word', type: 'Form', company: 'Poonphol Group', department: 'Education & e-Learning', lastUpdate: '2024-05-09', fileUrl: '#' },
  { id: 'doc-14', name: 'Disaster Recovery Manual', nameThai: 'คู่มือการกู้คืนระบบจากภัยพิบัติ', fileType: 'pdf', type: 'Manual', company: 'Poonphol Trading', department: 'Sustainable Energy', lastUpdate: '2024-04-03', fileUrl: '#' },
  { id: 'doc-15', name: 'Office Relocation Announcement', nameThai: 'ประกาศการย้ายสำนักงาน', fileType: 'word', type: 'Announcement', company: 'Poonphol Logistics', department: 'Real Estate & Proptech', lastUpdate: '2024-03-11', fileUrl: '#' },
  { id: 'doc-16', name: 'Quarterly Compliance Report', nameThai: 'รายงานการปฏิบัติตามกฎระเบียบรายไตรมาส', fileType: 'excel', type: 'Report', company: 'Poonphol Digital', department: 'E-commerce & Retail', lastUpdate: '2024-02-14', fileUrl: '#' },
  { id: 'doc-17', name: 'Brand Identity Template', nameThai: 'เทมเพลตอัตลักษณ์แบรนด์', fileType: 'powerpoint', type: 'Template', company: 'Poonphol Group', department: 'Entertainment & Media', lastUpdate: '2024-01-20', fileUrl: '#' },
  { id: 'doc-18', name: 'Travel Expense Policy', nameThai: 'นโยบายค่าใช้จ่ายในการเดินทาง', fileType: 'word', type: 'Policy', company: 'Poonphol Trading', department: 'Travel & Hospitality', lastUpdate: '2023-12-05', fileUrl: '#' },
  { id: 'doc-19', name: 'New Hire Onboarding SOP', nameThai: 'ขั้นตอนการปฐมนิเทศพนักงานใหม่', fileType: 'pdf', type: 'SOP', company: 'Poonphol Logistics', department: 'Telecommunications & Networking', lastUpdate: '2023-11-16', fileUrl: '#' },
  { id: 'doc-20', name: 'Expense Reimbursement Form', nameThai: 'แบบฟอร์มขอเบิกค่าใช้จ่าย', fileType: 'excel', type: 'Form', company: 'Poonphol Digital', department: 'Healthcare & Biotechnology', lastUpdate: '2023-10-01', fileUrl: '#' }
];

const CATEGORY_DEFINITIONS: Array<{ id: string; type: DocumentTypeTag; label: string; labelThai: string; iconName: string; tintColor: string }> = [
  { id: 'policy', type: 'Policy', label: 'Policy', labelThai: 'นโยบายบริษัท', iconName: 'shieldCheck', tintColor: '#0f6d4e' },
  { id: 'sop', type: 'SOP', label: 'SOP', labelThai: 'ขั้นตอนการปฏิบัติงาน', iconName: 'clipboardList', tintColor: '#0f6d4e' },
  { id: 'form', type: 'Form', label: 'Form', labelThai: 'แบบฟอร์มต่างๆ', iconName: 'fileEdit', tintColor: '#0f6d4e' },
  { id: 'announcement', type: 'Announcement', label: 'Announcement', labelThai: 'ประกาศบริษัท', iconName: 'megaphone', tintColor: '#0f6d4e' },
  { id: 'manual', type: 'Manual', label: 'Manual', labelThai: 'คู่มือการใช้งาน', iconName: 'menuBook', tintColor: '#0f6d4e' }
];

export function fetchDocuments(): DocumentItem[] {
  return MOCK_DOCUMENTS;
}

export function getDocumentCategorySummaries(documents: DocumentItem[]): DocumentCategorySummary[] {
  return CATEGORY_DEFINITIONS.map(definition => ({
    id: definition.id,
    label: definition.label,
    labelThai: definition.labelThai,
    iconName: definition.iconName,
    tintColor: definition.tintColor,
    count: documents.filter(doc => doc.type === definition.type).length
  }));
}

export interface DocumentFilters {
  search: string;
  company: string;
  department: string;
  type: string;
}

export const DEFAULT_DOCUMENT_FILTERS: DocumentFilters = {
  search: '',
  company: 'All',
  department: 'All',
  type: 'All'
};

export function filterDocuments(documents: DocumentItem[], filters: DocumentFilters): DocumentItem[] {
  const search = filters.search.trim().toLowerCase();

  return documents.filter(doc => {
    const matchesSearch = search.length === 0 || doc.name.toLowerCase().includes(search) || doc.nameThai.includes(search);
    const matchesCompany = filters.company === 'All' || doc.company === filters.company;
    const matchesDepartment = filters.department === 'All' || doc.department === filters.department;
    const matchesType = filters.type === 'All' || doc.type === filters.type;

    return matchesSearch && matchesCompany && matchesDepartment && matchesType;
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
