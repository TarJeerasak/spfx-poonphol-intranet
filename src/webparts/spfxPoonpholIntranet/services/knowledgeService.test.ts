import {
  buildKnowledgeAttachments,
  buildKnowledgeCategories,
  filterRecommendedKnowledgeItems,
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

describe('filterRecommendedKnowledgeItems', () => {
  it('keeps only items with IsRecommended checked', () => {
    const items = [
      { Id: 1, IsRecommended: true },
      { Id: 2, IsRecommended: false },
      { Id: 3 }
    ] as never[];

    expect(filterRecommendedKnowledgeItems(items).map(item => item.Id)).toEqual([1]);
  });

  it('returns an empty array when nothing is recommended', () => {
    expect(filterRecommendedKnowledgeItems([{ Id: 1 }] as never[])).toEqual([]);
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
      Author0: 'สมชาย ใจดี',
      IsRecommended: true,
      Active: true,
      ShortDescription: 'สำนักตรวจสอบขอเชิญชวนทุกท่านติดตามสื่อสร้างสรรค์ด้านจรรยาบรรณในการทำงาน',
      Description: 'A short guide on staying safe online.',
      Created: '2026-01-05T00:00:00Z',
      Modified: '2026-07-10T00:00:00Z'
    };

    expect(mapToKnowledgeItem(raw, { readCount: 12, likeCount: 3 })).toEqual({
      id: '5',
      categoryId: 'Mindset',
      tags: ['Keyword', 'Test'],
      title: 'ETHICS MATTERS EP.1-4',
      authorName: 'สมชาย ใจดี',
      shortDescription: 'สำนักตรวจสอบขอเชิญชวนทุกท่านติดตามสื่อสร้างสรรค์ด้านจรรยาบรรณในการทำงาน',
      description: 'A short guide on staying safe online.',
      imageUrl: 'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/km-5.jpg',
      readCount: 12,
      likeCount: 3,
      isRecommended: true,
      attachments: [],
      createdAt: '2026-01-05T00:00:00Z',
      modifiedAt: '2026-07-10T00:00:00Z'
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

  it('resolves the thumbnail from the reserved attachment when ThumbnailImage uses the modern Image-column shape', () => {
    const raw = {
      Id: 65,
      Title: 'การตั้งรหัสผ่านที่ปลอดภัย',
      AttachmentFiles: [
        { ServerRelativeUrl: '/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/Reserved_ImageAttachment_[14]_[ThumbnailImage][32]_[hash][1].jpg' },
        { ServerRelativeUrl: '/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/THINK First - Password-EP2.jpg' }
      ],
      ThumbnailImage: JSON.stringify({ fileName: 'Reserved_ImageAttachment_[14]_[ThumbnailImage][32]_[hash][1].jpg' }),
      Category: 'Mindset',
      Active: true
    };

    const result = mapToKnowledgeItem(raw);

    expect(result.imageUrl).toEqual(
      'https://poonphol.sharepoint.com/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/Reserved_ImageAttachment_%5B14%5D_%5BThumbnailImage%5D%5B32%5D_%5Bhash%5D%5B1%5D.jpg'
    );
    // The reserved attachment backs the thumbnail itself, so it must not also appear as a
    // user-facing attachment/gallery image - only the separately uploaded file should.
    expect(result.attachments).toEqual([
      {
        name: 'THINK First - Password-EP2.jpg',
        url: 'https://poonphol.sharepoint.com/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/THINK%20First%20-%20Password-EP2.jpg',
        serverRelativeUrl: '/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/THINK First - Password-EP2.jpg',
        fileType: 'JPG'
      }
    ]);
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
      authorName: '',
      shortDescription: '',
      description: '',
      imageUrl: '',
      readCount: 0,
      likeCount: 0,
      isRecommended: false,
      attachments: [],
      createdAt: '',
      modifiedAt: ''
    });
  });
});

describe('buildKnowledgeAttachments', () => {
  it('maps each attachment to a name, absolute url, and uppercase file type', () => {
    expect(
      buildKnowledgeAttachments([
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/handbook.pdf' },
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/quiz.docx' }
      ])
    ).toEqual([
      {
        name: 'handbook.pdf',
        url: 'https://poonphol.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/handbook.pdf',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/handbook.pdf',
        fileType: 'PDF'
      },
      {
        name: 'quiz.docx',
        url: 'https://poonphol.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/quiz.docx',
        serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/6/quiz.docx',
        fileType: 'DOCX'
      }
    ]);
  });

  it('returns an empty array when there are no attachments', () => {
    expect(buildKnowledgeAttachments(undefined)).toEqual([]);
    expect(buildKnowledgeAttachments([])).toEqual([]);
  });

  it('excludes the hidden Reserved_ImageAttachment file SharePoint creates for the Image column', () => {
    expect(
      buildKnowledgeAttachments([
        { ServerRelativeUrl: '/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/Reserved_ImageAttachment_[14]_[1].jpg' },
        { ServerRelativeUrl: '/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/handbook.pdf' }
      ])
    ).toEqual([
      {
        name: 'handbook.pdf',
        url: 'https://poonphol.sharepoint.com/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/handbook.pdf',
        serverRelativeUrl: '/sites/PPG_UAT/Lists/KnowledgeManagementList1/Attachments/65/handbook.pdf',
        fileType: 'PDF'
      }
    ]);
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
      { id: '1', categoryId: 'Mindset', tags: [], title: '', authorName: '', shortDescription: '', description: '', imageUrl: '', readCount: 0, likeCount: 0, isRecommended: false, attachments: [], createdAt: '', modifiedAt: '' },
      { id: '2', categoryId: 'Learning', tags: [], title: '', authorName: '', shortDescription: '', description: '', imageUrl: '', readCount: 0, likeCount: 0, isRecommended: false, attachments: [], createdAt: '', modifiedAt: '' },
      { id: '3', categoryId: 'Mindset', tags: [], title: '', authorName: '', shortDescription: '', description: '', imageUrl: '', readCount: 0, likeCount: 0, isRecommended: false, attachments: [], createdAt: '', modifiedAt: '' }
    ];

    expect(buildKnowledgeCategories(items)).toEqual([
      { id: 'all', label: 'ดูทั้งหมด' },
      { id: 'Mindset', label: 'Mindset' },
      { id: 'Learning', label: 'Learning' }
    ]);
  });

  it('ignores items without a category', () => {
    const items = [
      { id: '1', categoryId: '', tags: [], title: '', authorName: '', shortDescription: '', description: '', imageUrl: '', readCount: 0, likeCount: 0, isRecommended: false, attachments: [], createdAt: '', modifiedAt: '' }
    ];

    expect(buildKnowledgeCategories(items)).toEqual([{ id: 'all', label: 'ดูทั้งหมด' }]);
  });
});
