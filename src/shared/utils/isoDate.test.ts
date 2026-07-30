import { parseIsoDate, toIsoDate } from './isoDate';

describe('parseIsoDate', () => {
  it('parses a yyyy-mm-dd string as a local-midnight Date', () => {
    const result = parseIsoDate('2026-07-30');
    expect(result?.getFullYear()).toEqual(2026);
    expect(result?.getMonth()).toEqual(6);
    expect(result?.getDate()).toEqual(30);
    expect(result?.getHours()).toEqual(0);
  });

  it('returns undefined for an empty string', () => {
    expect(parseIsoDate('')).toBeUndefined();
  });
});

describe('toIsoDate', () => {
  it('formats a Date as yyyy-mm-dd, zero-padded', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toEqual('2026-01-05');
  });

  it('returns an empty string for undefined', () => {
    expect(toIsoDate(undefined)).toEqual('');
  });

  it('round-trips with parseIsoDate', () => {
    expect(toIsoDate(parseIsoDate('2026-07-30'))).toEqual('2026-07-30');
  });
});
