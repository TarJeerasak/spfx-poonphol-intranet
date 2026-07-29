import { parseThumbnailImage } from './parseThumbnailImage';

describe('parseThumbnailImage', () => {
  it('builds an absolute url from a valid thumbnail field value', () => {
    const rawValue = JSON.stringify({
      serverUrl: 'https://fusionsoftcompany.sharepoint.com',
      serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/news-1.jpg'
    });

    expect(parseThumbnailImage(rawValue)).toEqual(
      'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/news-1.jpg'
    );
  });

  it('falls back to the relative url when serverUrl is missing', () => {
    const rawValue = JSON.stringify({ serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/news-1.jpg' });

    expect(parseThumbnailImage(rawValue)).toEqual('/sites/Project-PoonpholIntranetPortal/SiteAssets/news-1.jpg');
  });

  it('returns an empty string for undefined or empty input', () => {
    expect(parseThumbnailImage(undefined)).toEqual('');
    expect(parseThumbnailImage('')).toEqual('');
  });

  it('returns an empty string for malformed json', () => {
    expect(parseThumbnailImage('not-json')).toEqual('');
  });

  it('returns an empty string when serverRelativeUrl is missing', () => {
    expect(parseThumbnailImage(JSON.stringify({ serverUrl: 'https://fusionsoftcompany.sharepoint.com' }))).toEqual('');
  });
});
