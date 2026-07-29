import { getFirstName } from './getFirstName';

describe('getFirstName', () => {
  it('drops the last name and bracketed nickname', () => {
    expect(getFirstName('Jeerasak Sookchai [Ta]')).toEqual('Jeerasak');
  });

  it('handles a display name with no nickname', () => {
    expect(getFirstName('Jeerasak Sookchai')).toEqual('Jeerasak');
  });

  it('handles a display name with only a first name', () => {
    expect(getFirstName('Jeerasak')).toEqual('Jeerasak');
  });

  it('returns an empty string for an empty display name', () => {
    expect(getFirstName('')).toEqual('');
  });
});
