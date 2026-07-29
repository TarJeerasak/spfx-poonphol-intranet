const THAI_MONTHS_ABBREVIATED = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export interface ThaiDayAndMonth {
  day: string;
  monthLabel: string;
}

export function formatThaiDayAndMonth(date: Date): ThaiDayAndMonth {
  return {
    day: String(date.getDate()),
    monthLabel: THAI_MONTHS_ABBREVIATED[date.getMonth()]
  };
}
