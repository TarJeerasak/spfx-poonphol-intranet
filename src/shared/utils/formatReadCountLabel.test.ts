import { formatReadCountLabel } from './formatReadCountLabel';

describe('formatReadCountLabel', () => {
  it('formats a positive read count', () => {
    expect(formatReadCountLabel(2374)).toBe('มีคนอ่านไปแล้ว 2374 คน');
  });

  it('falls back to 0 when the read count is 0', () => {
    expect(formatReadCountLabel(0)).toBe('มีคนอ่านไปแล้ว 0 คน');
  });

  it('falls back to 0 when the read count is undefined', () => {
    expect(formatReadCountLabel(undefined as unknown as number)).toBe('มีคนอ่านไปแล้ว 0 คน');
  });
});
