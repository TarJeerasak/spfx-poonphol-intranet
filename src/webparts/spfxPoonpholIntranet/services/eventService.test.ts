import { mapToEventItem, selectEventItemsByClosestDateFrom } from './eventService';

const NOW = new Date(2026, 6, 24).getTime();

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
      Image: JSON.stringify({
        serverUrl: 'https://fusionsoftcompany.sharepoint.com',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/event-13.jpg'
      }),
      Category: { Title: 'จ.ระยอง' },
      DateFrom: '2026-06-13T08:00:00',
      DateTo: '2026-06-13T12:00:00',
      Active: true
    };

    expect(mapToEventItem(raw)).toEqual({
      id: '13',
      title: 'กิจกรรม Culture Talk',
      dateDay: '13',
      dateMonthLabel: 'มิ.ย.',
      timeLabel: '08:00 - 12:00',
      locationLabel: 'จ.ระยอง',
      imageUrl: 'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/event-13.jpg',
      attendeeAvatarUrls: [],
      overflowCount: 0
    });
  });

  it('falls back to empty values when optional fields are missing', () => {
    const raw = {
      Id: 7,
      Title: 'No schedule yet',
      Active: true
    };

    expect(mapToEventItem(raw)).toEqual({
      id: '7',
      title: 'No schedule yet',
      dateDay: '',
      dateMonthLabel: '',
      timeLabel: '',
      locationLabel: '',
      imageUrl: '',
      attendeeAvatarUrls: [],
      overflowCount: 0
    });
  });
});
