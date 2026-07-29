import { getSiteOrigin } from './siteOrigin';

describe('getSiteOrigin', () => {
  it('extracts the protocol + host from a site url with a path', () => {
    expect(getSiteOrigin('https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal')).toEqual(
      'https://fusionsoftcompany.sharepoint.com'
    );
  });

  it('returns the input unchanged when it has no path', () => {
    expect(getSiteOrigin('https://fusionsoftcompany.sharepoint.com')).toEqual('https://fusionsoftcompany.sharepoint.com');
  });
});
