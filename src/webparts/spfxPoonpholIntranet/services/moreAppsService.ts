import { AppCategory, AppCategoryId, AppItem } from '../../../shared/types/content';

export const APP_COMPANIES = ['PPC', 'PPS', 'PPP', 'VGM'];

export const APP_CATEGORIES: AppCategory[] = [
  { id: 'human-resources', label: 'Human Resources', backgroundColor: '#dff7e5', textColor: '#00582a' },
  { id: 'export', label: 'Export', backgroundColor: '#fff2d6', textColor: '#946b00' },
  { id: 'accounting', label: 'Accounting', backgroundColor: '#e8b5ff', textColor: '#4b0869' },
  { id: 'office', label: 'Office', backgroundColor: '#dbebfc', textColor: '#1a57db' },
  { id: 'business', label: 'Business', backgroundColor: '#ffedd6', textColor: '#c2400d' },
  { id: 'dt', label: 'DT', backgroundColor: '#fdffc9', textColor: '#57590f' }
];

export const INITIAL_FAVORITE_APP_IDS = ['hr-portal', 'employee-directory'];

const MOCK_APPS: AppItem[] = [
  { id: 'hr-portal', name: 'HR Portal', descriptionThai: 'ระบบบริหารทรัพยากรบุคคลครบวงจร', categoryId: 'human-resources', company: 'PPC', usageCount: 482, isNew: false, lastUsedAt: '2026-07-29', launchUrl: '#' },
  { id: 'employee-directory', name: 'Employee Directory', descriptionThai: 'ฐานข้อมูลพนักงานที่เข้าถึงได้ง่าย', categoryId: 'human-resources', company: 'PPC', usageCount: 401, isNew: false, lastUsedAt: '2026-07-28', launchUrl: '#' },
  { id: 'leave-management', name: 'Leave Management', descriptionThai: 'ระบบจัดการวันลาและสิทธิ์พนักงาน', categoryId: 'human-resources', company: 'PPS', usageCount: 355, isNew: false, lastUsedAt: '2026-07-20', launchUrl: '#' },
  { id: 'performance-review', name: 'Performance Review', descriptionThai: 'การประเมินผลการทำงานอย่างต่อเนื่อง', categoryId: 'human-resources', company: 'PPS', usageCount: 210, isNew: false, lastUsedAt: '2026-06-30', launchUrl: '#' },
  { id: 'payroll-system', name: 'Payroll System', descriptionThai: 'ระบบจ่ายเงินเดือนอัตโนมัติที่แม่นยำ', categoryId: 'export', company: 'PPP', usageCount: 300, isNew: false, lastUsedAt: '2026-07-15', launchUrl: '#' },
  { id: 'budget-planning', name: 'Budget Planning', descriptionThai: 'การวางแผนงบประมาณอย่างมีประสิทธิภาพ', categoryId: 'export', company: 'PPP', usageCount: 180, isNew: false, lastUsedAt: '2026-07-10', launchUrl: '#' },
  { id: 'expense-tracking', name: 'Expense Tracking', descriptionThai: 'ระบบติดตามค่าใช้จ่ายแบบเรียลไทม์', categoryId: 'accounting', company: 'VGM', usageCount: 265, isNew: false, lastUsedAt: '2026-07-22', launchUrl: '#' },
  { id: 'accounting-reports', name: 'Accounting Reports', descriptionThai: 'รายงานทางการเงินที่ครบถ้วนและโปร่งใส', categoryId: 'accounting', company: 'VGM', usageCount: 190, isNew: false, lastUsedAt: '2026-07-05', launchUrl: '#' },
  { id: 'help-desk', name: 'Help Desk', descriptionThai: 'ระบบแจ้งปัญหาและติดตามการแก้ไข', categoryId: 'office', company: 'PPC', usageCount: 520, isNew: false, lastUsedAt: '2026-07-29', launchUrl: '#' },
  { id: 'network-monitor', name: 'Network Monitor', descriptionThai: 'ระบบตรวจสอบเครือข่ายตลอด 24 ชม.', categoryId: 'office', company: 'PPC', usageCount: 140, isNew: true, lastUsedAt: '2026-07-27', launchUrl: '#' },
  { id: 'asset-management', name: 'Asset Management', descriptionThai: 'ระบบจัดการทรัพย์สินด้าน IT', categoryId: 'office', company: 'PPS', usageCount: 95, isNew: true, lastUsedAt: '2026-07-18', launchUrl: '#' },
  { id: 'security-center', name: 'Security Center', descriptionThai: 'ศูนย์รักษาความปลอดภัยทางไซเบอร์', categoryId: 'office', company: 'PPS', usageCount: 88, isNew: true, lastUsedAt: '2026-07-12', launchUrl: '#' },
  { id: 'lead-management', name: 'Lead Management', descriptionThai: 'ระบบจัดการลูกค้าเป้าหมาย', categoryId: 'business', company: 'PPP', usageCount: 120, isNew: false, lastUsedAt: '2026-06-25', launchUrl: '#' },
  { id: 'campaign-tracker', name: 'Campaign Tracker', descriptionThai: 'ติดตามแคมเปญการตลาดแบบเรียลไทม์', categoryId: 'business', company: 'PPP', usageCount: 75, isNew: true, lastUsedAt: '2026-07-01', launchUrl: '#' },
  { id: 'sales-analytics', name: 'Sales Analytics', descriptionThai: 'วิเคราะห์ข้อมูลการขายเชิงลึก', categoryId: 'dt', company: 'VGM', usageCount: 160, isNew: true, lastUsedAt: '2026-07-24', launchUrl: '#' },
  { id: 'crm-system', name: 'CRM System', descriptionThai: 'ระบบบริหารความสัมพันธ์ลูกค้า', categoryId: 'dt', company: 'VGM', usageCount: 210, isNew: false, lastUsedAt: '2026-07-19', launchUrl: '#' }
];

export function fetchApps(): AppItem[] {
  return MOCK_APPS;
}

export function getAppCategory(categoryId: AppCategoryId): AppCategory {
  return APP_CATEGORIES.find(category => category.id === categoryId) ?? APP_CATEGORIES[0];
}

export type AppTab = 'all' | 'favorites' | 'recent' | 'frequent' | 'new';

export interface AppFilters {
  search: string;
  company: string;
  categoryId: string;
  tab: AppTab;
}

export const DEFAULT_APP_FILTERS: AppFilters = {
  search: '',
  company: 'All',
  categoryId: 'All',
  tab: 'all'
};

export function filterApps(apps: AppItem[], filters: AppFilters, favoriteIds: ReadonlySet<string>): AppItem[] {
  const search = filters.search.trim().toLowerCase();

  return apps.filter(app => {
    const matchesSearch = search.length === 0 || app.name.toLowerCase().includes(search) || app.descriptionThai.includes(search);
    const matchesCompany = filters.company === 'All' || app.company === filters.company;
    const matchesCategory = filters.categoryId === 'All' || app.categoryId === filters.categoryId;
    const matchesTab = filters.tab !== 'favorites' || favoriteIds.has(app.id);

    return matchesSearch && matchesCompany && matchesCategory && matchesTab;
  });
}

export function sortAppsForTab(apps: AppItem[], tab: AppTab): AppItem[] {
  if (tab === 'recent') {
    return [...apps].sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime());
  }
  if (tab === 'frequent') {
    return [...apps].sort((a, b) => b.usageCount - a.usageCount);
  }
  if (tab === 'new') {
    return apps.filter(app => app.isNew);
  }
  return apps;
}
