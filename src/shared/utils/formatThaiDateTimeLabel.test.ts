import { formatThaiDateTimeLabel } from './formatThaiDateTimeLabel';

describe('formatThaiDateTimeLabel', () => {
  it('formats a date with an abbreviated Thai month, Buddhist era year, and time', () => {
    expect(formatThaiDateTimeLabel(new Date(2024, 8, 12, 14, 0))).toEqual('12 ก.ย. 2567 เวลา 14:00 น.');
  });

  it('pads single-digit hours and minutes', () => {
    expect(formatThaiDateTimeLabel(new Date(2024, 8, 12, 9, 5))).toEqual('12 ก.ย. 2567 เวลา 09:05 น.');
  });
});
