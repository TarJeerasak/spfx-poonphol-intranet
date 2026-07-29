import { mapToAnnouncement, selectAnnouncementsByClosestEffectiveDate } from './announcementService';
import { formatThaiDateTimeLabel } from '../../../shared/utils/formatThaiDateTimeLabel';

const NOW = new Date(2026, 6, 24).getTime();

function buildItem(id: number, effectiveDate?: string): { Id: number; EffectiveDate?: string } {
  return { Id: id, EffectiveDate: effectiveDate };
}

describe('selectAnnouncementsByClosestEffectiveDate', () => {
  it('orders items by how close their effective date is to now, nearest first', () => {
    const items = [
      buildItem(1, '2026-05-01T00:00:00Z'),
      buildItem(2, '2026-07-24T00:00:00Z'),
      buildItem(3, '2026-08-10T00:00:00Z')
    ] as never[];

    const result = selectAnnouncementsByClosestEffectiveDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 3, 1]);
  });

  it('limits the result to maxCount items', () => {
    const items = [buildItem(1, '2026-07-24T00:00:00Z'), buildItem(2, '2026-07-23T00:00:00Z'), buildItem(3, '2026-07-22T00:00:00Z'), buildItem(4, '2026-07-21T00:00:00Z')] as never[];

    const result = selectAnnouncementsByClosestEffectiveDate(items, NOW);

    expect(result).toHaveLength(3);
  });
});

describe('mapToAnnouncement', () => {
  it('maps a SharePoint NewsList item to the Announcement shape used by the UI', () => {
    const raw = {
      Id: 12,
      Title: 'ปิดปรับปรุงระบบ',
      PageContent: '<p>ระบบจะปิดปรับปรุงชั่วคราว</p>',
      PublishDate: '2024-09-12T14:00:00Z',
      EffectiveDate: '2024-09-12T14:00:00Z',
      Active: true,
      NewsType: 'Announcement'
    };

    expect(mapToAnnouncement(raw)).toEqual({
      id: '12',
      title: 'ปิดปรับปรุงระบบ',
      description: 'ระบบจะปิดปรับปรุงชั่วคราว',
      dateTimeLabel: formatThaiDateTimeLabel(new Date(raw.PublishDate))
    });
  });

  it('falls back to empty strings when optional fields are missing', () => {
    const raw = {
      Id: 5,
      Title: 'No content',
      Active: true
    };

    expect(mapToAnnouncement(raw)).toEqual({
      id: '5',
      title: 'No content',
      description: '',
      dateTimeLabel: ''
    });
  });
});
