import { mapToNewsItem, selectNewsItemsByClosestEffectiveDate } from './newsService';

const NOW = new Date(2026, 6, 24).getTime();

function buildItem(id: number, effectiveDate?: string): { Id: number; EffectiveDate?: string } {
  return { Id: id, EffectiveDate: effectiveDate };
}

describe('selectNewsItemsByClosestEffectiveDate', () => {
  it('orders items by how close their effective date is to now, nearest first', () => {
    const items = [
      buildItem(1, '2026-05-01T00:00:00Z'),
      buildItem(2, '2026-07-24T00:00:00Z'),
      buildItem(3, '2026-08-10T00:00:00Z')
    ] as never[];

    const result = selectNewsItemsByClosestEffectiveDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 3, 1]);
  });

  it('limits the result to maxCount items', () => {
    const items = [buildItem(1, '2026-07-24T00:00:00Z'), buildItem(2, '2026-07-23T00:00:00Z'), buildItem(3, '2026-07-22T00:00:00Z')] as never[];

    const result = selectNewsItemsByClosestEffectiveDate(items, NOW, 2);

    expect(result).toHaveLength(2);
  });

  it('pushes items without an effective date to the end', () => {
    const items = [buildItem(1), buildItem(2, '2026-07-24T00:00:00Z')] as never[];

    const result = selectNewsItemsByClosestEffectiveDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 1]);
  });
});

describe('mapToNewsItem', () => {
  it('maps a SharePoint NewsList item to the NewsItem shape used by the UI', () => {
    const raw = {
      Id: 42,
      Title: 'Group Orientation',
      PageContent: '<p>บรรยากาศกิจกรรม</p><p>ภาพรวมงาน</p>',
      ThumbnailImage: JSON.stringify({
        serverUrl: 'https://fusionsoftcompany.sharepoint.com',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/news-42.jpg'
      }),
      Category: 'Business',
      Location: 'บริษัท เอส ที เอ็ม เอส จำกัด',
      Time: '09:00 - 12:00',
      PublishDate: '2026-06-10T00:00:00Z',
      EffectiveDate: '2026-06-10T00:00:00Z',
      Active: true,
      NewsType: 'News',
      Author: { Title: 'Poonphol Group', EMail: 'poonphol.group@fusionsoftcompany.com' }
    };

    expect(mapToNewsItem(raw)).toEqual({
      id: '42',
      title: 'Group Orientation',
      excerpt: 'บรรยากาศกิจกรรม\nภาพรวมงาน',
      imageUrl: 'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/news-42.jpg',
      tag: 'Business',
      tagColor: '#63b37d',
      dateLabel: '10 มิ.ย. 2569',
      timeLabel: '09:00 - 12:00',
      locationLabel: 'บริษัท เอส ที เอ็ม เอส จำกัด',
      authorName: 'Poonphol Group',
      authorAvatarUrl: expect.stringContaining('poonphol.group%40fusionsoftcompany.com')
    });
  });

  it('falls back to the default tag color for an unrecognized category', () => {
    const raw = {
      Id: 43,
      Title: 'Company Anniversary',
      Category: 'Activities',
      Active: true
    };

    expect(mapToNewsItem(raw).tagColor).toBe('#e2445c');
  });

  it('falls back to empty strings when optional fields are missing', () => {
    const raw = {
      Id: 7,
      Title: 'No description',
      Active: true
    };

    expect(mapToNewsItem(raw)).toEqual({
      id: '7',
      title: 'No description',
      excerpt: '',
      imageUrl: '',
      tag: '',
      tagColor: '#63b37d',
      dateLabel: '',
      timeLabel: '',
      locationLabel: '',
      authorName: '',
      authorAvatarUrl: ''
    });
  });
});
