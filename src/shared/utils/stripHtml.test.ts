import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('turns paragraph and line-break tags into newlines', () => {
    expect(stripHtml('<p>Hello</p><p>World</p>')).toEqual('Hello\nWorld');
    expect(stripHtml('Line one<br>Line two')).toEqual('Line one\nLine two');
  });

  it('strips inline tags without adding extra whitespace', () => {
    expect(stripHtml('<p>Hello <strong>there</strong> friend</p>')).toEqual('Hello there friend');
  });

  it('decodes common html entities', () => {
    expect(stripHtml('Tom &amp; Jerry &nbsp;Co.')).toEqual('Tom & Jerry  Co.');
  });

  it('drops empty lines produced by nested block tags', () => {
    expect(stripHtml('<div><p>Hello</p></div><p>World</p>')).toEqual('Hello\nWorld');
  });

  it('returns an empty string for empty input', () => {
    expect(stripHtml('')).toEqual('');
  });
});
