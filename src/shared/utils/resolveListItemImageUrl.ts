import { SITE_ORIGIN } from './siteOrigin';

export interface IAttachmentFile {
  ServerRelativeUrl: string;
}

// Falls back to the item's first attachment when the dedicated image field is empty -
// authors on this list often attach the image instead of using the Thumbnail column.
export function resolveListItemImageUrl(thumbnailImageUrl: string, attachmentFiles: IAttachmentFile[] | undefined): string {
  if (thumbnailImageUrl) {
    return thumbnailImageUrl;
  }

  const firstAttachment = attachmentFiles?.[0];
  return firstAttachment ? `${SITE_ORIGIN}${firstAttachment.ServerRelativeUrl}` : '';
}
