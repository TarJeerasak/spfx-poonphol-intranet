import {
  buildKnowledgeCategories,
  mapToKnowledgeItem,
  resolveKnowledgeListTitle,
  selectKnowledgeItemsByClosestPublishDate
} from './knowledgeService';

const NOW = new Date(2026, 6, 24).getTime();

function buildItem(id: number, publishDate?: string): { Id: number; PublishDate?: string } {
  return { Id: id, PublishDate: publishDate };
}

describe('selectKnowledgeItemsByClosestPublishDate', () => {
  it('orders items by how close Publish Date is to now, nearest first', () => {
    const items = [
      buildItem(1, '2026-05-01T00:00:00'),
      buildItem(2, '2026-07-24T00:00:00'),
      buildItem(3, '2026-08-10T00:00:00')
    ] as never[];

    const result = selectKnowledgeItemsByClosestPublishDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 3, 1]);
  });

  it('limits the result to maxCount items', () => {
    const items = [
      buildItem(1, '2026-07-24T00:00:00'),
      buildItem(2, '2026-07-23T00:00:00'),
      buildItem(3, '2026-07-22T00:00:00'),
      buildItem(4, '2026-07-21T00:00:00')
    ] as never[];

    const result = selectKnowledgeItemsByClosestPublishDate(items, NOW, 2);

    expect(result).toHaveLength(2);
  });

  it('pushes items without a Publish Date to the end', () => {
    const items = [buildItem(1), buildItem(2, '2026-07-24T00:00:00')] as never[];

    const result = selectKnowledgeItemsByClosestPublishDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 1]);
  });
});

describe('mapToKnowledgeItem', () => {
  it('maps a KnowledgeManagementList item to the KnowledgeItem shape used by the UI', () => {
    const raw = {
      Id: 5,
      Title: 'ETHICS MATTERS EP.1-4',
      Tag: ['Keyword', 'Test'],
      ThumbnailImage: JSON.stringify({
        serverUrl: 'https://fusionsoftcompany.sharepoint.com',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/km-5.jpg'
      }),
      PublishDate: '2026-06-10T00:00:00',
      Category: 'Mindset',
      Active: true
    };

    expect(mapToKnowledgeItem(raw)).toEqual({
      id: '5',
      categoryId: 'Mindset',
      tags: ['Keyword', 'Test'],
      title: 'ETHICS MATTERS EP.1-4',
      progressLabel: '',
      progressPercent: 0,
      locationLabel: '',
      imageUrl: 'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/km-5.jpg'
    });
  });

  it('falls back to the first attachment when the thumbnail image field is empty', () => {
    const raw = {
      Id: 6,
      Title: 'Romance Scam',
      Tag: ['Keyword'],
      AttachmentFiles: [{ ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/album01.png' }],
      PublishDate: '2026-06-10T00:00:00',
      Category: 'Learning',
      Active: true
    };

    expect(mapToKnowledgeItem(raw).imageUrl).toEqual(
      'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/album01.png'
    );
  });

  it('falls back to empty values when optional fields are missing', () => {
    const raw = {
      Id: 9,
      Title: 'No category yet',
      Active: true
    };

    expect(mapToKnowledgeItem(raw)).toEqual({
      id: '9',
      categoryId: '',
      tags: [],
      title: 'No category yet',
      progressLabel: '',
      progressPercent: 0,
      locationLabel: '',
      imageUrl: ''
    });
  });
});

describe('resolveKnowledgeListTitle', () => {
  it('uses KnowledgeManagementList1 for the PPG_UAT site', () => {
    expect(resolveKnowledgeListTitle('https://poonphol.sharepoint.com/sites/PPG_UAT')).toBe('KnowledgeManagementList1');
  });

  it('falls back to KnowledgeManagementList for any other site', () => {
    expect(resolveKnowledgeListTitle('https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal')).toBe(
      'KnowledgeManagementList'
    );
  });
});

describe('buildKnowledgeCategories', () => {
  it('prefixes an "all" tab followed by the distinct categories found in the items', () => {
    const items = [
      { id: '1', categoryId: 'Mindset', tags: [], title: '', progressLabel: '', progressPercent: 0, locationLabel: '', imageUrl: '' },
      { id: '2', categoryId: 'Learning', tags: [], title: '', progressLabel: '', progressPercent: 0, locationLabel: '', imageUrl: '' },
      { id: '3', categoryId: 'Mindset', tags: [], title: '', progressLabel: '', progressPercent: 0, locationLabel: '', imageUrl: '' }
    ];

    expect(buildKnowledgeCategories(items)).toEqual([
      { id: 'all', label: 'ดูทั้งหมด' },
      { id: 'Mindset', label: 'Mindset' },
      { id: 'Learning', label: 'Learning' }
    ]);
  });

  it('ignores items without a category', () => {
    const items = [{ id: '1', categoryId: '', tags: [], title: '', progressLabel: '', progressPercent: 0, locationLabel: '', imageUrl: '' }];

    expect(buildKnowledgeCategories(items)).toEqual([{ id: 'all', label: 'ดูทั้งหมด' }]);
  });
});
