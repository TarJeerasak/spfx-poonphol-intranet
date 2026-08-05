import { parseDescriptionSegments } from './parseDescriptionLinks';

describe('parseDescriptionSegments', () => {
  it('returns a single text segment when there is no anchor tag', () => {
    expect(parseDescriptionSegments('Plain description text.')).toEqual([{ type: 'text', value: 'Plain description text.' }]);
  });

  it('splits surrounding text from an embedded anchor tag', () => {
    expect(parseDescriptionSegments('ง่ายๆ เพียง 3 ขั้นตอน <a href="https://example.com/guide">คลิกที่นี่</a> เลย')).toEqual([
      { type: 'text', value: 'ง่ายๆ เพียง 3 ขั้นตอน ' },
      { type: 'link', value: 'คลิกที่นี่', href: 'https://example.com/guide' },
      { type: 'text', value: ' เลย' }
    ]);
  });

  it('keeps an anchor tag as literal text when its href is not http(s)', () => {
    expect(parseDescriptionSegments('<a href="javascript:alert(1)">click</a>')).toEqual([
      { type: 'text', value: '<a href="javascript:alert(1)">click</a>' }
    ]);
  });

  it('handles multiple anchor tags in the same description', () => {
    expect(parseDescriptionSegments('<a href="https://a.test">A</a> and <a href="https://b.test">B</a>')).toEqual([
      { type: 'link', value: 'A', href: 'https://a.test' },
      { type: 'text', value: ' and ' },
      { type: 'link', value: 'B', href: 'https://b.test' }
    ]);
  });
});
