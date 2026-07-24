const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const BUDDHIST_ERA_OFFSET = 543;

export function formatThaiDate(date: Date): string {
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const buddhistYear = date.getFullYear() + BUDDHIST_ERA_OFFSET;
  return `${day} ${month} ${buddhistYear}`;
}
