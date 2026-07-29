import { formatThaiDayAndMonth } from './formatThaiDayAndMonth';

describe('formatThaiDayAndMonth', () => {
  it('splits a date into day number and abbreviated Thai month', () => {
    expect(formatThaiDayAndMonth(new Date(2026, 5, 13))).toEqual({ day: '13', monthLabel: 'มิ.ย.' });
  });

  it('handles single-digit days without zero padding', () => {
    expect(formatThaiDayAndMonth(new Date(2026, 0, 5))).toEqual({ day: '5', monthLabel: 'ม.ค.' });
  });

  it('handles december', () => {
    expect(formatThaiDayAndMonth(new Date(2026, 11, 25))).toEqual({ day: '25', monthLabel: 'ธ.ค.' });
  });
});
