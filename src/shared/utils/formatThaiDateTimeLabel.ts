import { formatThaiDateShort } from './formatThaiDateShort';

function pad(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

export function formatThaiDateTimeLabel(date: Date): string {
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${formatThaiDateShort(date)} เวลา ${timePart} น.`;
}
