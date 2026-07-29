import { shouldClampText } from './shouldClampText';

describe('shouldClampText', () => {
  it('returns false for text at or under the threshold', () => {
    expect(shouldClampText('short post', 20)).toEqual(false);
    expect(shouldClampText('a'.repeat(20), 20)).toEqual(false);
  });

  it('returns true for text longer than the threshold', () => {
    expect(shouldClampText('a'.repeat(21), 20)).toEqual(true);
  });

  it('uses the default threshold when none is given', () => {
    expect(shouldClampText('short post')).toEqual(false);
  });
});
