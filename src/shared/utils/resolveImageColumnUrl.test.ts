import { buildAttachmentUrl, isReservedAttachment, resolveImageColumnUrl } from './resolveImageColumnUrl';

describe('resolveImageColumnUrl', () => {
  it('uses the legacy Picture-column shape when present', () => {
    expect(
      resolveImageColumnUrl(
        JSON.stringify({
          serverUrl: 'https://fusionsoftcompany.sharepoint.com',
          serverRelativeUrl: '/sites/Project-PoonpholIntranetPortal/SiteAssets/event-13.jpg'
        }),
        undefined
      )
    ).toEqual('https://fusionsoftcompany.sharepoint.com/sites/Project-PoonpholIntranetPortal/SiteAssets/event-13.jpg');
  });

  it('resolves the modern Image-column shape by matching the reserved attachment', () => {
    const rawImageValue = JSON.stringify({ fileName: 'Reserved_ImageAttachment_[14]_[Image][32]_[hash][1].jpg' });
    const attachmentFiles = [
      { ServerRelativeUrl: '/sites/PPG_UAT/Lists/CalendarList/Attachments/65/Reserved_ImageAttachment_[14]_[Image][32]_[hash][1].jpg' },
      { ServerRelativeUrl: '/sites/PPG_UAT/Lists/CalendarList/Attachments/65/poster.jpg' }
    ];

    expect(resolveImageColumnUrl(rawImageValue, attachmentFiles)).toEqual(
      'https://poonphol.sharepoint.com/sites/PPG_UAT/Lists/CalendarList/Attachments/65/Reserved_ImageAttachment_%5B14%5D_%5BImage%5D%5B32%5D_%5Bhash%5D%5B1%5D.jpg'
    );
  });

  it('falls back to the first real attachment when the image field has no value', () => {
    const attachmentFiles = [
      { ServerRelativeUrl: '/sites/PPG_UAT/Lists/CalendarList/Attachments/65/Reserved_ImageAttachment_[1].jpg' },
      { ServerRelativeUrl: '/sites/PPG_UAT/Lists/CalendarList/Attachments/65/poster.jpg' }
    ];

    expect(resolveImageColumnUrl(undefined, attachmentFiles)).toEqual(
      'https://poonphol.sharepoint.com/sites/PPG_UAT/Lists/CalendarList/Attachments/65/poster.jpg'
    );
  });

  it('returns an empty string when there is no image field value and no attachments', () => {
    expect(resolveImageColumnUrl(undefined, undefined)).toEqual('');
    expect(resolveImageColumnUrl('', [])).toEqual('');
  });
});

describe('isReservedAttachment', () => {
  it('flags files whose name starts with Reserved_', () => {
    expect(isReservedAttachment({ ServerRelativeUrl: '/sites/x/Attachments/1/Reserved_ImageAttachment_[1].jpg' })).toBe(true);
    expect(isReservedAttachment({ ServerRelativeUrl: '/sites/x/Attachments/1/poster.jpg' })).toBe(false);
  });
});

describe('buildAttachmentUrl', () => {
  it('encodes special characters in the server-relative path', () => {
    expect(buildAttachmentUrl({ ServerRelativeUrl: '/sites/x/Attachments/1/THINK First - Password.jpg' })).toEqual(
      'https://poonphol.sharepoint.com/sites/x/Attachments/1/THINK%20First%20-%20Password.jpg'
    );
  });
});
