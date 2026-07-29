import { formatThaiDateShort } from './formatThaiDateShort';

describe('formatThaiDateShort', () => {
  it('formats a date with an abbreviated Thai month and Buddhist era year', () => {
    expect(formatThaiDateShort(new Date(2026, 6, 29))).toEqual('29 ก.ค. 2569');
  });

  it('handles the first day of January correctly', () => {
    expect(formatThaiDateShort(new Date(2025, 0, 1))).toEqual('1 ม.ค. 2568');
  });

  it('handles the last day of December correctly', () => {
    expect(formatThaiDateShort(new Date(2025, 11, 31))).toEqual('31 ธ.ค. 2568');
  });
});
