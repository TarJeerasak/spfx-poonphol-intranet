import { formatRelativeThaiTime } from './formatRelativeThaiTime';
import { formatThaiDateShort } from './formatThaiDateShort';

const NOW = new Date(2026, 6, 24, 12, 0, 0).getTime();

describe('formatRelativeThaiTime', () => {
  it('returns "เมื่อสักครู่" for less than a minute ago', () => {
    expect(formatRelativeThaiTime(new Date(NOW - 30 * 1000), NOW)).toEqual('เมื่อสักครู่');
  });

  it('formats minutes ago', () => {
    expect(formatRelativeThaiTime(new Date(NOW - 5 * 60 * 1000), NOW)).toEqual('5 นาทีที่แล้ว');
  });

  it('formats hours ago', () => {
    expect(formatRelativeThaiTime(new Date(NOW - 3 * 60 * 60 * 1000), NOW)).toEqual('3 ชั่วโมงที่แล้ว');
  });

  it('formats 1 and 2 days ago as relative time', () => {
    expect(formatRelativeThaiTime(new Date(NOW - 1 * 24 * 60 * 60 * 1000), NOW)).toEqual('1 วันที่แล้ว');
    expect(formatRelativeThaiTime(new Date(NOW - 2 * 24 * 60 * 60 * 1000), NOW)).toEqual('2 วันที่แล้ว');
  });

  it('falls back to a short absolute Thai date once older than 2 days', () => {
    const threeDaysAgo = new Date(NOW - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeThaiTime(threeDaysAgo, NOW)).toEqual(formatThaiDateShort(threeDaysAgo));

    const oldDate = new Date(2026, 5, 10);
    expect(formatRelativeThaiTime(oldDate, NOW)).toEqual(formatThaiDateShort(oldDate));
  });

  it('treats a future date as "just now" instead of a negative offset', () => {
    expect(formatRelativeThaiTime(new Date(NOW + 60 * 1000), NOW)).toEqual('เมื่อสักครู่');
  });
});
