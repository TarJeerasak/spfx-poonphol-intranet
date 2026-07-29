import { resolveListItemImageUrl } from './resolveListItemImageUrl';

describe('resolveListItemImageUrl', () => {
  it('prefers the thumbnail image url when present', () => {
    expect(resolveListItemImageUrl('https://fusionsoftcompany.sharepoint.com/site-assets/km-1.jpg', [
      { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/1/banner.jpg' }
    ])).toEqual('https://fusionsoftcompany.sharepoint.com/site-assets/km-1.jpg');
  });

  it('falls back to the first attachment when the thumbnail image url is empty', () => {
    expect(
      resolveListItemImageUrl('', [
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/1/banner.jpg' },
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/1/second.jpg' }
      ])
    ).toEqual('https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/KnowledgeManagementList/Attachments/1/banner.jpg');
  });

  it('returns an empty string when there is no thumbnail image and no attachments', () => {
    expect(resolveListItemImageUrl('', undefined)).toEqual('');
    expect(resolveListItemImageUrl('', [])).toEqual('');
  });
});
