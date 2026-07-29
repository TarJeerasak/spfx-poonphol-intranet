import { parseMultiChoiceValue } from './parseMultiChoiceValue';

describe('parseMultiChoiceValue', () => {
  it('returns an array value as-is, dropping empty entries', () => {
    expect(parseMultiChoiceValue(['Keyword', 'Test'])).toEqual(['Keyword', 'Test']);
    expect(parseMultiChoiceValue(['Keyword', ''])).toEqual(['Keyword']);
  });

  it('splits a semicolon-delimited string into trimmed values', () => {
    expect(parseMultiChoiceValue('Keyword; Test')).toEqual(['Keyword', 'Test']);
  });

  it('wraps a single plain string in an array', () => {
    expect(parseMultiChoiceValue('Keyword')).toEqual(['Keyword']);
  });

  it('returns an empty array for undefined or empty input', () => {
    expect(parseMultiChoiceValue(undefined)).toEqual([]);
    expect(parseMultiChoiceValue('')).toEqual([]);
    expect(parseMultiChoiceValue([])).toEqual([]);
  });
});
