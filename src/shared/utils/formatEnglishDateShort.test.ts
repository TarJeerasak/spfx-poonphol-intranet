import { formatEnglishDateShort } from './formatEnglishDateShort';

describe('formatEnglishDateShort', () => {
  it('formats a date with a zero-padded day and abbreviated English month', () => {
    expect(formatEnglishDateShort(new Date(2025, 4, 1))).toEqual('01 May 2025');
  });

  it('handles the first day of January correctly', () => {
    expect(formatEnglishDateShort(new Date(2025, 0, 1))).toEqual('01 Jan 2025');
  });

  it('handles the last day of December correctly', () => {
    expect(formatEnglishDateShort(new Date(2025, 11, 31))).toEqual('31 Dec 2025');
  });
});
