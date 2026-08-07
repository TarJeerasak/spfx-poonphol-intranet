import {
  buildAnnouncementAttachments,
  filterAnnouncements,
  getAnnouncementTypeOptions,
  mapToAnnouncement,
  paginateAnnouncements,
  selectAnnouncementsByClosestEffectiveDate,
  sortAnnouncements
} from './announcementService';
import { Announcement } from '../../../shared/types/content';
import { formatThaiDateShort } from '../../../shared/utils/formatThaiDateShort';
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
      NewsType: 'Announcement',
      AnnouncementType: 'ด่วน',
      Modified: '2024-09-13T09:00:00Z',
      AttachmentFiles: [{ ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/NewsList/Attachments/12/policy.pdf' }]
    };

    expect(mapToAnnouncement(raw)).toEqual({
      id: '12',
      title: 'ปิดปรับปรุงระบบ',
      description: 'ระบบจะปิดปรับปรุงชั่วคราว',
      publishedAtIso: '2024-09-12T14:00:00Z',
      dateTimeLabel: formatThaiDateTimeLabel(new Date(raw.PublishDate)),
      dateLabel: formatThaiDateShort(new Date(raw.PublishDate)),
      updatedLabel: formatThaiDateShort(new Date(raw.Modified)),
      typeLabel: 'ด่วน',
      typeColor: '#ffcacd',
      typeTextColor: '#870007',
      typeBorderColor: '#870007',
      attachments: buildAnnouncementAttachments(raw.AttachmentFiles)
    });
  });

  it('falls back to empty strings and the "ทั่วไป" style when optional fields are missing', () => {
    const raw = {
      Id: 5,
      Title: 'No content',
      Active: true
    };

    expect(mapToAnnouncement(raw)).toEqual({
      id: '5',
      title: 'No content',
      description: '',
      publishedAtIso: '',
      dateTimeLabel: '',
      dateLabel: '',
      updatedLabel: '',
      typeLabel: '',
      typeColor: '#e0fff2',
      typeTextColor: '#0e5536',
      typeBorderColor: '#0e5536',
      attachments: []
    });
  });
});

describe('buildAnnouncementAttachments', () => {
  it('maps SharePoint AttachmentFiles into name/url/fileType', () => {
    expect(
      buildAnnouncementAttachments([
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/NewsList/Attachments/12/policy.pdf' }
      ])
    ).toEqual([
      {
        name: 'policy.pdf',
        url: expect.stringContaining('/sites/Project-PoonpholIntranetPortal/Lists/NewsList/Attachments/12/policy.pdf'),
        fileType: 'PDF'
      }
    ]);
  });

  it('returns an empty array when there are no attachments', () => {
    expect(buildAnnouncementAttachments(undefined)).toEqual([]);
    expect(buildAnnouncementAttachments([])).toEqual([]);
  });
});

function buildAnnouncement(overrides: Partial<Announcement>): Announcement {
  return {
    id: '1',
    title: 'Announcement',
    description: '',
    publishedAtIso: '2026-01-01T00:00:00Z',
    dateTimeLabel: '',
    dateLabel: '',
    updatedLabel: '',
    typeLabel: 'ทั่วไป',
    typeColor: '#e0fff2',
    typeTextColor: '#0e5536',
    typeBorderColor: '#0e5536',
    attachments: [],
    ...overrides
  };
}

describe('getAnnouncementTypeOptions', () => {
  it('orders present types to match the SharePoint choice column order', () => {
    const items = [
      buildAnnouncement({ typeLabel: 'ทั่วไป' }),
      buildAnnouncement({ typeLabel: 'ด่วน' }),
      buildAnnouncement({ typeLabel: 'ปิดประกาศ' })
    ];

    expect(getAnnouncementTypeOptions(items)).toEqual(['ด่วน', 'ทั่วไป', 'ปิดประกาศ']);
  });
});

describe('filterAnnouncements', () => {
  const items = [
    buildAnnouncement({ id: '1', title: 'นโยบายการทำงานจากที่บ้าน', typeLabel: 'ด่วน' }),
    buildAnnouncement({ id: '2', title: 'แจ้งวันหยุดนักขัตฤกษ์', typeLabel: 'ทั่วไป' })
  ];

  it('filters by title search, case-insensitively', () => {
    expect(filterAnnouncements(items, { search: 'วันหยุด', type: 'all' }).map(item => item.id)).toEqual(['2']);
  });

  it('filters by type', () => {
    expect(filterAnnouncements(items, { search: '', type: 'ด่วน' }).map(item => item.id)).toEqual(['1']);
  });
});

describe('sortAnnouncements', () => {
  const items = [
    buildAnnouncement({ id: 'old', publishedAtIso: '2026-01-01T00:00:00Z' }),
    buildAnnouncement({ id: 'new', publishedAtIso: '2026-06-01T00:00:00Z' })
  ];

  it('orders latest first when order is "latest"', () => {
    expect(sortAnnouncements(items, 'latest').map(item => item.id)).toEqual(['new', 'old']);
  });

  it('orders oldest first when order is "oldest"', () => {
    expect(sortAnnouncements(items, 'oldest').map(item => item.id)).toEqual(['old', 'new']);
  });
});

describe('paginateAnnouncements', () => {
  const items = Array.from({ length: 25 }, (_, index) => buildAnnouncement({ id: String(index) }));

  it('slices items for the requested page', () => {
    const result = paginateAnnouncements(items, 2, 10);

    expect(result.items).toHaveLength(10);
    expect(result.items[0].id).toBe('10');
    expect(result.pageCount).toBe(3);
    expect(result.totalCount).toBe(25);
  });

  it('clamps the page number within range', () => {
    expect(paginateAnnouncements(items, 99, 10).page).toBe(3);
    expect(paginateAnnouncements(items, 0, 10).page).toBe(1);
  });
});
