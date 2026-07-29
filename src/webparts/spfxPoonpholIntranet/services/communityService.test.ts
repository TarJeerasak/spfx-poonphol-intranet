import { mapToCommunityPost, selectCommunityItemsByClosestCreatedDate } from './communityService';

const NOW = new Date(2026, 6, 24).getTime();

function buildItem(id: number, created?: string): { Id: number; Created?: string } {
  return { Id: id, Created: created };
}

describe('selectCommunityItemsByClosestCreatedDate', () => {
  it('orders items by how close Created is to now, nearest first', () => {
    const items = [
      buildItem(1, '2026-05-01T00:00:00'),
      buildItem(2, '2026-07-24T00:00:00'),
      buildItem(3, '2026-08-10T00:00:00')
    ] as never[];

    const result = selectCommunityItemsByClosestCreatedDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 3, 1]);
  });

  it('limits the result to maxCount items', () => {
    const items = [
      buildItem(1, '2026-07-24T00:00:00'),
      buildItem(2, '2026-07-23T00:00:00'),
      buildItem(3, '2026-07-22T00:00:00'),
      buildItem(4, '2026-07-21T00:00:00')
    ] as never[];

    const result = selectCommunityItemsByClosestCreatedDate(items, NOW, 2);

    expect(result).toHaveLength(2);
  });

  it('pushes items without a Created date to the end', () => {
    const items = [buildItem(1), buildItem(2, '2026-07-24T00:00:00')] as never[];

    const result = selectCommunityItemsByClosestCreatedDate(items, NOW);

    expect(result.map(item => item.Id)).toEqual([2, 1]);
  });
});

describe('mapToCommunityPost', () => {
  it('maps a Poonphol_Community item to the CommunityPost shape used by the UI, sourcing images from AttachmentFiles', () => {
    const raw = {
      Id: 12,
      Description: '<p>Great teamwork today!</p>',
      LikeCount: 24,
      Created: '2026-06-10T00:00:00',
      Author: { Title: 'Michael Chen', EMail: 'michael.chen@fusionsoftcompany.com', JobTitle: 'Operations Manager' },
      AttachmentFiles: [
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/12/photo1.jpg' },
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/12/photo2.jpg' }
      ],
      Active: true
    };

    expect(mapToCommunityPost(raw, NOW)).toEqual({
      id: '12',
      authorName: 'Michael Chen',
      authorRole: 'Operations Manager',
      postedAtLabel: '10 มิ.ย. 2569',
      authorAvatarUrl:
        'https://fusionsoftcompany.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=michael.chen%40fusionsoftcompany.com',
      text: 'Great teamwork today!',
      imageUrls: [
        'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/12/photo1.jpg',
        'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/12/photo2.jpg'
      ],
      likeCount: 24
    });
  });

  it('renders postedAtLabel as relative time for a recently created post', () => {
    const raw = {
      Id: 14,
      Created: new Date(NOW - 3 * 60 * 60 * 1000).toISOString(),
      Active: true
    };

    expect(mapToCommunityPost(raw, NOW).postedAtLabel).toEqual('3 ชั่วโมงที่แล้ว');
  });

  it('ignores any image embedded in Description now that Attachments is the source of truth for photos', () => {
    const raw = {
      Id: 13,
      Description: '<p>Text only</p><img src="/sites/Project-PoonpholIntranetPortal/SiteAssets/inline.jpg" alt="" />',
      Active: true
    };

    expect(mapToCommunityPost(raw, NOW).imageUrls).toEqual([]);
  });

  it('falls back to empty values when optional fields are missing', () => {
    const raw = {
      Id: 3,
      Active: true
    };

    expect(mapToCommunityPost(raw, NOW)).toEqual({
      id: '3',
      authorName: '',
      authorRole: '',
      postedAtLabel: '',
      authorAvatarUrl: '',
      text: '',
      imageUrls: [],
      likeCount: 0
    });
  });
});
