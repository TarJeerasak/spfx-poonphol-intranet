import { formatThaiDate } from './formatThaiDate';

describe('formatThaiDate', () => {
  it('formats a date with the Thai month name and Buddhist era year', () => {
    expect(formatThaiDate(new Date(2026, 5, 10))).toEqual('10 มิถุนายน 2569');
  });

  it('handles the first day of January correctly', () => {
    expect(formatThaiDate(new Date(2025, 0, 1))).toEqual('1 มกราคม 2568');
  });

  it('handles the last day of December correctly', () => {
    expect(formatThaiDate(new Date(2025, 11, 31))).toEqual('31 ธันวาคม 2568');
  });
});
