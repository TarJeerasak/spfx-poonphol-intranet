import { estimateReadTimeMinutes } from './estimateReadTimeMinutes';

describe('estimateReadTimeMinutes', () => {
  it('rounds up to the nearest minute', () => {
    const text = new Array(201).fill('word').join(' ');
    expect(estimateReadTimeMinutes(text)).toBe(2);
  });

  it('returns 1 minute for short text', () => {
    expect(estimateReadTimeMinutes('a short piece of text')).toBe(1);
  });

  it('returns 1 minute for empty text', () => {
    expect(estimateReadTimeMinutes('')).toBe(1);
  });

  it('returns 1 minute for whitespace-only text', () => {
    expect(estimateReadTimeMinutes('   \n  ')).toBe(1);
  });
});
