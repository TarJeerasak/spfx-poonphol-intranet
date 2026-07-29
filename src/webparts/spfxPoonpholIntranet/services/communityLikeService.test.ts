import { buildLikedPostMap } from './communityLikeService';

describe('buildLikedPostMap', () => {
  it('maps each Post_ID to its History_Community_Like item id', () => {
    expect(
      buildLikedPostMap([
        { Id: 101, Post_ID: 12 },
        { Id: 102, Post_ID: 13 }
      ])
    ).toEqual({
      '12': 101,
      '13': 102
    });
  });

  it('returns an empty map for no liked posts', () => {
    expect(buildLikedPostMap([])).toEqual({});
  });
});
