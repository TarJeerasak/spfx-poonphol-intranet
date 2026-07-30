import { buildFavoriteAppMap, findOldestFavorite, mapToFavoriteAppLink } from './favoriteAppsService';

describe('buildFavoriteAppMap', () => {
  it('maps each App_ID to its Favorite_Apps item id', () => {
    expect(
      buildFavoriteAppMap([
        { Id: 101, App_ID: 12 },
        { Id: 102, App_ID: 13 }
      ])
    ).toEqual({
      '12': 101,
      '13': 102
    });
  });

  it('returns an empty map for no favorites', () => {
    expect(buildFavoriteAppMap([])).toEqual({});
  });
});

describe('findOldestFavorite', () => {
  it('returns the record with the smallest item id', () => {
    const records = [
      { Id: 103, App_ID: 14 },
      { Id: 101, App_ID: 12 },
      { Id: 102, App_ID: 13 }
    ];

    expect(findOldestFavorite(records)).toEqual({ Id: 101, App_ID: 12 });
  });

  it('returns undefined for an empty list', () => {
    expect(findOldestFavorite([])).toBeUndefined();
  });
});

describe('mapToFavoriteAppLink', () => {
  it('maps a Favorite_Apps record to the link shape used by the home page', () => {
    expect(mapToFavoriteAppLink({ Id: 101, App_ID: 12, Title: 'HR Portal', URL: 'https://poonphol.sharepoint.com/hr-portal' })).toEqual({
      id: '12',
      name: 'HR Portal',
      launchUrl: 'https://poonphol.sharepoint.com/hr-portal'
    });
  });

  it('falls back to an empty name and # url when Title or URL are missing', () => {
    expect(mapToFavoriteAppLink({ Id: 101, App_ID: 12 })).toEqual({
      id: '12',
      name: '',
      launchUrl: '#'
    });
  });
});
