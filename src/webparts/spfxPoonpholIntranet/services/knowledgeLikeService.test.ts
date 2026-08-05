import { buildLikedKnowledgeMap } from './knowledgeLikeService';

describe('buildLikedKnowledgeMap', () => {
  it('maps each KM_ID to its History_KM_Like item id', () => {
    expect(
      buildLikedKnowledgeMap([
        { Id: 201, KM_ID: 5 },
        { Id: 202, KM_ID: 6 }
      ])
    ).toEqual({
      '5': 201,
      '6': 202
    });
  });

  it('returns an empty map for no liked items', () => {
    expect(buildLikedKnowledgeMap([])).toEqual({});
  });
});
