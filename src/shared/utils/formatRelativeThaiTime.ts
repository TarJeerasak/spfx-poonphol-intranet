import { formatThaiDateShort } from './formatThaiDateShort';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const RELATIVE_TIME_MAX_DAYS = 2;

export function formatRelativeThaiTime(date: Date, now: number): string {
  const diffMs = now - date.getTime();

  if (diffMs < MINUTE_MS) {
    return 'เมื่อสักครู่';
  }
  if (diffMs < HOUR_MS) {
    return `${Math.floor(diffMs / MINUTE_MS)} นาทีที่แล้ว`;
  }
  if (diffMs < DAY_MS) {
    return `${Math.floor(diffMs / HOUR_MS)} ชั่วโมงที่แล้ว`;
  }

  const days = Math.floor(diffMs / DAY_MS);
  return days <= RELATIVE_TIME_MAX_DAYS ? `${days} วันที่แล้ว` : formatThaiDateShort(date);
}
