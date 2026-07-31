import { AppItem } from '../../../shared/types/content';
import {
  DEFAULT_APP_FILTERS,
  filterApps,
  getAppCategories,
  getAppCategory,
  getAppCompanies,
  mapToAppItem,
  sortAppsForTab
} from './moreAppsService';

function buildApp(overrides: Partial<AppItem>): AppItem {
  return {
    id: 'app-1',
    name: 'Sample App',
    descriptionThai: 'แอปตัวอย่าง',
    categoryId: 'Office',
    company: 'PPC',
    usageCount: 0,
    isNew: false,
    lastUsedAt: '2026-01-01',
    launchUrl: '#',
    ...overrides
  };
}

const NOW = new Date(2026, 6, 24);

describe('mapToAppItem', () => {
  it('maps an Inter-ApplList item to the AppItem shape used by the UI', () => {
    const raw = {
      Id: 12,
      Title: 'HR Portal',
      Description: 'ระบบบริหารทรัพยากรบุคคลครบวงจร',
      URL: 'https://poonphol.sharepoint.com/sites/PPG_UAT/hr-portal',
      Department: { Title: 'Human Resources' },
      Company: { Title: 'PPC' },
      Active: true
    };

    expect(mapToAppItem(raw, NOW)).toEqual({
      id: '12',
      name: 'HR Portal',
      descriptionThai: 'ระบบบริหารทรัพยากรบุคคลครบวงจร',
      categoryId: 'Human Resources',
      company: 'PPC',
      usageCount: 0,
      isNew: false,
      lastUsedAt: '',
      launchUrl: 'https://poonphol.sharepoint.com/sites/PPG_UAT/hr-portal'
    });
  });

  it('falls back to empty strings when Description, Department, Company, or URL are missing', () => {
    const raw = { Id: 13, Title: 'Minimal App', Active: true };

    const result = mapToAppItem(raw, NOW);
    expect(result.descriptionThai).toEqual('');
    expect(result.categoryId).toEqual('');
    expect(result.company).toEqual('');
    expect(result.launchUrl).toEqual('#');
  });

  it('strips HTML from a rich-text Description', () => {
    const raw = { Id: 14, Title: 'App', Description: '<p>Line one</p><p>Line two</p>', Active: true };

    expect(mapToAppItem(raw, NOW).descriptionThai).toEqual('Line one\nLine two');
  });

  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  it('marks an app created within the last 30 days as new', () => {
    const raw = { Id: 15, Title: 'App', Active: true, Created: new Date(NOW.getTime() - 10 * DAY_IN_MS).toISOString() };

    expect(mapToAppItem(raw, NOW).isNew).toBe(true);
  });

  it('treats exactly 30 days ago as still new', () => {
    const raw = { Id: 16, Title: 'App', Active: true, Created: new Date(NOW.getTime() - 30 * DAY_IN_MS).toISOString() };

    expect(mapToAppItem(raw, NOW).isNew).toBe(true);
  });

  it('does not mark an app created more than 30 days ago as new', () => {
    const raw = { Id: 17, Title: 'App', Active: true, Created: new Date(NOW.getTime() - 31 * DAY_IN_MS).toISOString() };

    expect(mapToAppItem(raw, NOW).isNew).toBe(false);
  });

  it('does not mark an app with no Created date as new', () => {
    const raw = { Id: 18, Title: 'App', Active: true };

    expect(mapToAppItem(raw, NOW).isNew).toBe(false);
  });
});

describe('getAppCategories', () => {
  it('derives one category per distinct Department value', () => {
    const apps = [
      buildApp({ id: 'app-1', categoryId: 'Human Resources' }),
      buildApp({ id: 'app-2', categoryId: 'Human Resources' }),
      buildApp({ id: 'app-3', categoryId: 'Accounting' })
    ];

    const categories = getAppCategories(apps);
    expect(categories.map(category => category.id)).toEqual(['Human Resources', 'Accounting']);
    expect(categories[0].label).toEqual('Human Resources');
  });

  it('ignores apps with no Department set', () => {
    const apps = [buildApp({ id: 'app-1', categoryId: '' })];
    expect(getAppCategories(apps)).toEqual([]);
  });
});

describe('getAppCompanies', () => {
  it('returns the distinct companies visible across the given apps', () => {
    const apps = [
      buildApp({ id: 'app-1', company: 'PPC' }),
      buildApp({ id: 'app-2', company: 'PPC' }),
      buildApp({ id: 'app-3', company: 'VGM' })
    ];

    expect(getAppCompanies(apps)).toEqual(['PPC', 'VGM']);
  });
});

describe('getAppCategory', () => {
  it('returns the matching category definition', () => {
    const categories = getAppCategories([buildApp({ categoryId: 'Accounting' })]);
    expect(getAppCategory(categories, 'Accounting').label).toEqual('Accounting');
  });

  it('falls back to a neutral category when the id is not found', () => {
    const category = getAppCategory([], 'Unknown');
    expect(category.id).toEqual('Unknown');
    expect(category.label).toEqual('Unknown');
  });
});

describe('filterApps', () => {
  const apps = [
    buildApp({ id: 'app-1', name: 'HR Portal', descriptionThai: 'ระบบบริหารทรัพยากรบุคคล', categoryId: 'Human Resources', company: 'PPC' }),
    buildApp({ id: 'app-2', name: 'CRM System', descriptionThai: 'ระบบบริหารความสัมพันธ์ลูกค้า', categoryId: 'DT', company: 'VGM' })
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
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, categoryId: 'Human Resources' }, new Set());
    expect(result.map(app => app.id)).toEqual(['app-1']);
  });

  it('filters by favorites when the favorites tab is selected', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, tab: 'favorites' }, new Set(['app-2']));
    expect(result.map(app => app.id)).toEqual(['app-2']);
  });

  it('combines multiple filters', () => {
    const result = filterApps(apps, { ...DEFAULT_APP_FILTERS, company: 'PPC', categoryId: 'DT' }, new Set());
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

  it('excludes apps the user has never opened from the recent and frequent tabs', () => {
    const withUnused = [...apps, buildApp({ id: 'app-unused', lastUsedAt: '', usageCount: 0 })];

    expect(sortAppsForTab(withUnused, 'recent').map(app => app.id)).not.toContain('app-unused');
    expect(sortAppsForTab(withUnused, 'frequent').map(app => app.id)).not.toContain('app-unused');
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
