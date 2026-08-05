import { EventCategory, mapToEventItem, resolveEventCategory, selectEventItemsByClosestDateFrom } from './eventService';

const NOW = new Date(2026, 6, 24).getTime();

const CATEGORIES: EventCategory[] = [
  { id: '3', label: 'กิจกรรมบริษัท', color: '#e0fff2', textColor: '#0e5536', borderColor: '#0e5536' },
  { id: '2', label: 'อบรมและสัมมนา', color: '#d8e8ff', textColor: '#116ffb', borderColor: '#116ffb' },
  { id: '1', label: 'CSR', color: '#dcbcff', textColor: '#3d0e70', borderColor: '#3d0e70' }
];

function buildItem(id: number, dateFrom?: string): { Id: number; DateFrom?: string } {
  return { Id: id, DateFrom: dateFrom };
}

describe('selectEventItemsByClosestDateFrom', () => {
  it('orders items by how close DateFrom is to now, nearest first', () => {
    const items = [
      buildItem(1, '2026-05-01T00:00:00'),
      buildItem(2, '2026-07-24T00:00:00'),
      buildItem(3, '2026-08-10T00:00:00')
    ] as never[];

    const result = selectEventItemsByClosestDateFrom(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 3, 1]);
  });

  it('limits the result to maxCount items', () => {
    const items = [
      buildItem(1, '2026-07-24T00:00:00'),
      buildItem(2, '2026-07-23T00:00:00'),
      buildItem(3, '2026-07-22T00:00:00')
    ] as never[];

    const result = selectEventItemsByClosestDateFrom(items, NOW, 2);

    expect(result).toHaveLength(2);
  });

  it('pushes items without a DateFrom to the end', () => {
    const items = [buildItem(1), buildItem(2, '2026-07-24T00:00:00')] as never[];

    const result = selectEventItemsByClosestDateFrom(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 1]);
  });
});

describe('mapToEventItem', () => {
  it('maps a CalendarList item to the EventItem shape used by the UI', () => {
    const raw = {
      Id: 13,
      Title: 'กิจกรรม Culture Talk',
      ShortDescription: '<p>อัพเดตกลยุทธ์และทิศทางขององค์กร</p>',
      Image: JSON.stringify({
        serverUrl: 'https://fusionsoftcompany.sharepoint.com',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/event-13.jpg'
      }),
      Location: 'จ.ระยอง',
      Time: '08:00 - 12:00',
      DateFrom: '2026-06-13T08:00:00',
      Active: true,
      Category: { Title: 'อบรมและสัมมนา' }
    };

    expect(mapToEventItem(raw, CATEGORIES)).toEqual({
      id: '13',
      categoryId: '2',
      categoryLabel: 'อบรมและสัมมนา',
      categoryColor: '#d8e8ff',
      categoryTextColor: '#116ffb',
      categoryBorderColor: '#116ffb',
      title: 'กิจกรรม Culture Talk',
      subtitle: 'อัพเดตกลยุทธ์และทิศทางขององค์กร',
      dateDay: '13',
      dateMonthLabel: 'มิ.ย.',
      dateFromIso: '2026-06-13T08:00:00',
      timeLabel: '08:00 - 12:00',
      locationLabel: 'จ.ระยอง',
      imageUrl: 'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/event-13.jpg',
      attendeeAvatarUrls: [],
      overflowCount: 0
    });
  });

  it('falls back to the first category when the item has no Category or it is unknown', () => {
    const raw = {
      Id: 7,
      Title: 'No schedule yet',
      Active: true
    };

    expect(mapToEventItem(raw, CATEGORIES)).toEqual({
      id: '7',
      categoryId: '3',
      categoryLabel: 'กิจกรรมบริษัท',
      categoryColor: '#e0fff2',
      categoryTextColor: '#0e5536',
      categoryBorderColor: '#0e5536',
      title: 'No schedule yet',
      subtitle: '',
      dateDay: '',
      dateMonthLabel: '',
      dateFromIso: '',
      timeLabel: '',
      locationLabel: '',
      imageUrl: '',
      attendeeAvatarUrls: [],
      overflowCount: 0
    });
  });
});

describe('resolveEventCategory', () => {
  it('matches a known category label', () => {
    expect(resolveEventCategory('CSR', CATEGORIES)).toEqual({
      id: '1',
      label: 'CSR',
      color: '#dcbcff',
      textColor: '#3d0e70',
      borderColor: '#3d0e70'
    });
  });

  it('falls back to the first category when the label is unknown or missing', () => {
    expect(resolveEventCategory('ไม่ทราบหมวดหมู่', CATEGORIES).id).toBe('3');
    expect(resolveEventCategory(undefined, CATEGORIES).id).toBe('3');
  });

  it('falls back to a generic default when there are no categories at all', () => {
    expect(resolveEventCategory('CSR', []).id).toBe('other');
  });
});
