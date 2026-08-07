import { isImageFileType } from './isImageFileType';

describe('isImageFileType', () => {
  it('recognizes common image file types, case-insensitively', () => {
    expect(isImageFileType('JPG')).toBe(true);
    expect(isImageFileType('png')).toBe(true);
    expect(isImageFileType('Webp')).toBe(true);
  });

  it('returns false for non-image file types', () => {
    expect(isImageFileType('PDF')).toBe(false);
    expect(isImageFileType('DOCX')).toBe(false);
    expect(isImageFileType('')).toBe(false);
  });
});
