import { AppItem } from '../../../shared/types/content';
import { DEFAULT_APP_FILTERS, filterApps, getAppCategory, sortAppsForTab } from './moreAppsService';

function buildApp(overrides: Partial<AppItem>): AppItem {
  return {
    id: 'app-1',
    name: 'Sample App',
    descriptionThai: 'แอปตัวอย่าง',
    categoryId: 'office',
    company: 'PPC',
    usageCount: 0,
    isNew: false,
    lastUsedAt: '2026-01-01',
    launchUrl: '#',
    ...overrides
  };
}

describe('filterApps', () => {
  const apps = [
    buildApp({ id: 'app-1', name: 'HR Portal', descriptionThai: 'ระบบบริหารทรัพยากรบุคคล', categoryId: 'human-resources', company: 'PPC' }),
    buildApp({ id: 'app-2', name: 'CRM System', descriptionThai: 'ระบบบริหารความสัมพันธ์ลูกค้า', categoryId: 'dt', company: 'VGM' })
  ];

  it('returns all apps when filters are left at defaults', () => {
    expect(filterApps(apps, DEFAULT_APP_FILTERS, new Set())).toHaveLength(2);
  });

  it('matches search text against the English name', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, search: 'crm' }, new Set());
    expect(result.map(app => app.id)).toEqual(['app-2']);
  });

  it('matches search text against the Thai description', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, search: 'ทรัพยากรบุคคล' }, new Set());
    expect(result.map(app => app.id)).toEqual(['app-1']);
  });

  it('filters by company', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, company: 'VGM' }, new Set());
    expect(result.map(app => app.id)).toEqual(['app-2']);
  });

  it('filters by category', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, categoryId: 'human-resources' }, new Set());
    expect(result.map(app => app.id)).toEqual(['app-1']);
  });

  it('filters by favorites when the favorites tab is selected', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, tab: 'favorites' }, new Set(['app-2']));
    expect(result.map(app => app.id)).toEqual(['app-2']);
  });

  it('combines multiple filters', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, company: 'PPC', categoryId: 'dt' }, new Set());
    expect(result).toHaveLength(0);
  });
});

describe('sortAppsForTab', () => {
  const apps = [
    buildApp({ id: 'app-old', lastUsedAt: '2023-01-01', usageCount: 10, isNew: false }),
    buildApp({ id: 'app-new', lastUsedAt: '2025-06-01', usageCount: 30, isNew: true }),
    buildApp({ id: 'app-mid', lastUsedAt: '2024-03-15', usageCount: 20, isNew: false })
  ];

  it('orders most recently used first for the recent tab', () => {
    expect(sortAppsForTab(apps, 'recent').map(app => app.id)).toEqual(['app-new', 'app-mid', 'app-old']);
  });

  it('orders highest usage first for the frequent tab', () => {
    expect(sortAppsForTab(apps, 'frequent').map(app => app.id)).toEqual(['app-new', 'app-mid', 'app-old']);
  });

  it('keeps only new apps for the new tab', () => {
    expect(sortAppsForTab(apps, 'new').map(app => app.id)).toEqual(['app-new']);
  });

  it('does not mutate the input array', () => {
    const original = [...apps];
    sortAppsForTab(apps, 'recent');
    expect(apps).toEqual(original);
  });

  it('returns apps unchanged for the all tab', () => {
    expect(sortAppsForTab(apps, 'all')).toEqual(apps);
  });
});

describe('getAppCategory', () => {
  it('returns the matching category definition', () => {
    expect(getAppCategory('accounting').label).toEqual('Accounting');
  });
});
