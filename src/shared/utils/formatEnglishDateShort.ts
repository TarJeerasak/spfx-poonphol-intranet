const ENGLISH_MONTHS_ABBREVIATED = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatEnglishDateShort(date: Date): string {
  const rawDay = date.getDate();
  const day = rawDay < 10 ? `0${rawDay}` : String(rawDay);
  const month = ENGLISH_MONTHS_ABBREVIATED[date.getMonth()];
  return `${day} ${month} ${date.getFullYear()}`;
}
