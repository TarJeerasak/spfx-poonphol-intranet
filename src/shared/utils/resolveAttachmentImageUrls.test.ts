import { resolveAttachmentImageUrls } from './resolveAttachmentImageUrls';

describe('resolveAttachmentImageUrls', () => {
  it('maps every attachment to an absolute url', () => {
    expect(
      resolveAttachmentImageUrls([
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/1/photo1.jpg' },
        { ServerRelativeUrl: '/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/1/photo2.jpg' }
      ])
    ).toEqual([
      'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/1/photo1.jpg',
      'https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/Lists/Poonphol_Community/Attachments/1/photo2.jpg'
    ]);
  });

  it('returns an empty array when there are no attachments', () => {
    expect(resolveAttachmentImageUrls(undefined)).toEqual([]);
    expect(resolveAttachmentImageUrls([])).toEqual([]);
  });
});
