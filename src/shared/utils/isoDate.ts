// Parses/formats a `yyyy-mm-dd` string as a local-midnight Date, not UTC midnight -
// `new Date('yyyy-mm-dd')` alone parses as UTC and can shift a calendar date filter
// by a day in non-UTC timezones.
export function parseIsoDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function zeroPad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function toIsoDate(date: Date | undefined): string {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = zeroPad(date.getMonth() + 1);
  const day = zeroPad(date.getDate());
  return `${year}-${month}-${day}`;
}
