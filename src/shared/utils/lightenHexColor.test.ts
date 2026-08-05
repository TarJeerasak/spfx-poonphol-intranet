import { lightenHexColor } from './lightenHexColor';

describe('lightenHexColor', () => {
  it('blends a color toward white by the given amount', () => {
    expect(lightenHexColor('#000000', 0.5)).toBe('#808080');
  });

  it('returns the original color when amount is 0', () => {
    expect(lightenHexColor('#3992f6', 0)).toBe('#3992f6');
  });

  it('returns white when amount is 1', () => {
    expect(lightenHexColor('#123456', 1)).toBe('#ffffff');
  });

  it('handles hex codes without a leading #', () => {
    expect(lightenHexColor('000000', 0.5)).toBe('#808080');
  });
});
