import { getCurrentDisplayTimePeriod, mapToHeroBanner, selectBannerItem } from './bannerService';

function buildItem(id: number, displayTime?: string, publishDate?: string): { Id: number; Display_Time?: string; PublishDate?: string } {
  return { Id: id, Display_Time: displayTime, PublishDate: publishDate };
}

describe('getCurrentDisplayTimePeriod', () => {
  it('returns เช้า between 06:00 and 11:59', () => {
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 6, 0))).toBe('เช้า');
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 11, 59))).toBe('เช้า');
  });

  it('returns บ่าย between 12:00 and 16:59', () => {
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 12, 0))).toBe('บ่าย');
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 16, 59))).toBe('บ่าย');
  });

  it('returns เย็น outside the เช้า/บ่าย windows, including overnight', () => {
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 17, 0))).toBe('เย็น');
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 23, 59))).toBe('เย็น');
    expect(getCurrentDisplayTimePeriod(new Date(2026, 6, 24, 5, 59))).toBe('เย็น');
  });
});

describe('selectBannerItem', () => {
  const now = new Date(2026, 6, 24, 9, 0);

  it("prefers a เทศกาล banner whose PublishDate matches today over the time-of-day banner", () => {
    const items = [
      buildItem(1, 'เช้า'),
      buildItem(2, 'เทศกาล', '2026-07-24T00:00:00'),
      buildItem(3, 'บ่าย')
    ];

    expect(selectBannerItem(items, now)?.Id).toBe(2);
  });

  it("ignores a เทศกาล banner whose PublishDate is not today", () => {
    const items = [buildItem(1, 'เทศกาล', '2026-07-20T00:00:00'), buildItem(2, 'เช้า')];

    expect(selectBannerItem(items, now)?.Id).toBe(2);
  });

  it('falls back to the banner matching the current time-of-day period', () => {
    const items = [buildItem(1, 'บ่าย'), buildItem(2, 'เย็น'), buildItem(3, 'เช้า')];

    expect(selectBannerItem(items, now)?.Id).toBe(3);
  });

  it('returns undefined when nothing matches', () => {
    const items = [buildItem(1, 'บ่าย'), buildItem(2, 'เย็น')];

    expect(selectBannerItem(items, now)).toBeUndefined();
  });
});

describe('mapToHeroBanner', () => {
  it('maps a SharePoint BannerHome item to the HeroBanner shape used by the UI', () => {
    const raw = {
      Id: 5,
      Title: 'Festival Banner',
      ThumbnailImage: JSON.stringify({
        serverUrl: 'https://fusionsoftcompany.sharepoint.com',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/banner-5.jpg'
      }),
      Display_Time: 'เทศกาล',
      PublishDate: '2026-07-24T00:00:00'
    };

    expect(mapToHeroBanner(raw)).toEqual({
      id: '5',
      title: 'Festival Banner',
      imageUrl: 'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/banner-5.jpg'
    });
  });

  it('falls back to empty strings when optional fields are missing', () => {
    const raw = { Id: 9 };

    expect(mapToHeroBanner(raw)).toEqual({ id: '9', title: '', imageUrl: '' });
  });
});
