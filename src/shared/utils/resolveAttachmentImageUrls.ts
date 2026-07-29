import { IAttachmentFile } from './resolveListItemImageUrl';
import { SITE_ORIGIN } from './siteOrigin';

export function resolveAttachmentImageUrls(attachmentFiles: IAttachmentFile[] | undefined): string[] {
  return (attachmentFiles ?? []).map(file => `${SITE_ORIGIN}${file.ServerRelativeUrl}`);
}
