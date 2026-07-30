import { buildAppUsageMap } from './appUsageService';

describe('buildAppUsageMap', () => {
  it('maps each App_ID to its History_App_Usage entry', () => {
    expect(
      buildAppUsageMap([
        { Id: 201, App_ID: 12, UsageCount: 5, LastUsed_Date: '2026-07-20T10:00:00Z' },
        { Id: 202, App_ID: 13, UsageCount: 1, LastUsed_Date: '2026-07-29T08:30:00Z' }
      ])
    ).toEqual({
      '12': { itemId: 201, usageCount: 5, lastUsedAt: '2026-07-20T10:00:00Z' },
      '13': { itemId: 202, usageCount: 1, lastUsedAt: '2026-07-29T08:30:00Z' }
    });
  });

  it('returns an empty map for no usage history', () => {
    expect(buildAppUsageMap([])).toEqual({});
  });
});
