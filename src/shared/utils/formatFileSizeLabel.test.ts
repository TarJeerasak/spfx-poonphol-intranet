import { formatFileSizeLabel } from './formatFileSizeLabel';

describe('formatFileSizeLabel', () => {
  it('formats bytes below 1 KB as bytes', () => {
    expect(formatFileSizeLabel(512)).toBe('512 B');
  });

  it('formats kilobyte-range sizes rounded to the nearest KB', () => {
    expect(formatFileSizeLabel(256000)).toBe('250 KB');
  });

  it('formats megabyte-range sizes with one decimal place', () => {
    expect(formatFileSizeLabel(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatFileSizeLabel(-1)).toBe('');
    expect(formatFileSizeLabel(NaN)).toBe('');
  });
});
