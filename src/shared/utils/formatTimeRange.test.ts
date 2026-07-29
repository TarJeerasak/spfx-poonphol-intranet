import { formatTimeRange } from './formatTimeRange';

describe('formatTimeRange', () => {
  it('formats a start and end time as HH:mm - HH:mm', () => {
    expect(formatTimeRange('2026-06-13T08:00:00', '2026-06-13T12:00:00')).toEqual('08:00 - 12:00');
  });

  it('pads single-digit hours and minutes', () => {
    expect(formatTimeRange('2026-06-13T09:05:00', '2026-06-13T09:30:00')).toEqual('09:05 - 09:30');
  });

  it('returns an empty string when either date is missing', () => {
    expect(formatTimeRange(undefined, '2026-06-13T12:00:00')).toEqual('');
    expect(formatTimeRange('2026-06-13T08:00:00', undefined)).toEqual('');
    expect(formatTimeRange(undefined, undefined)).toEqual('');
  });
});
