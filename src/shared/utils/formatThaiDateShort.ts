import { BUDDHIST_ERA_OFFSET } from './formatThaiDate';
import { THAI_MONTHS_ABBREVIATED } from './formatThaiDayAndMonth';

export function formatThaiDateShort(date: Date): string {
  const day = date.getDate();
  const month = THAI_MONTHS_ABBREVIATED[date.getMonth()];
  const buddhistYear = date.getFullYear() + BUDDHIST_ERA_OFFSET;
  return `${day} ${month} ${buddhistYear}`;
}
