import { buildKnowledgeCountMap } from './knowledgeCountService';

describe('buildKnowledgeCountMap', () => {
  it('maps each KM_ID to its read and like counts', () => {
    expect(
      buildKnowledgeCountMap([
        { Id: 1, KM_ID: 5, ReadCount: 12, LikeCount: 3 },
        { Id: 2, KM_ID: 6, ReadCount: 0, LikeCount: 0 }
      ])
    ).toEqual({
      '5': { readCount: 12, likeCount: 3 },
      '6': { readCount: 0, likeCount: 0 }
    });
  });

  it('falls back to zero when a counter column is empty', () => {
    expect(buildKnowledgeCountMap([{ Id: 1, KM_ID: 5 }])).toEqual({
      '5': { readCount: 0, likeCount: 0 }
    });
  });

  it('returns an empty map for no count records', () => {
    expect(buildKnowledgeCountMap([])).toEqual({});
  });
});
