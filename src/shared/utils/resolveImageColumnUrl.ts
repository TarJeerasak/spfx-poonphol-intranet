import { IAttachmentFile } from './resolveListItemImageUrl';
import { parseThumbnailImage } from './parseThumbnailImage';
import { SITE_ORIGIN } from './siteOrigin';

// SharePoint's modern "Image" column type stores the upload as a hidden attachment named
// "Reserved_ImageAttachment_..." rather than exposing a direct URL - it's SharePoint's own
// storage for the field, not a real user-facing attachment, so it must never surface as one.
const RESERVED_ATTACHMENT_PREFIX = 'Reserved_';

function getAttachmentFileName(file: IAttachmentFile): string {
  return file.ServerRelativeUrl.split('/').pop() ?? file.ServerRelativeUrl;
}

export function isReservedAttachment(file: IAttachmentFile): boolean {
  return getAttachmentFileName(file).indexOf(RESERVED_ATTACHMENT_PREFIX) === 0;
}

// SharePoint returns ServerRelativeUrl as a raw, unencoded path (spaces, brackets, Thai
// characters and all) - encodeURI it before use so file names with those characters resolve to
// a loadable URL instead of silently failing.
export function buildAttachmentUrl(file: IAttachmentFile): string {
  return `${SITE_ORIGIN}${encodeURI(file.ServerRelativeUrl)}`;
}

// An image field's raw value is either the legacy Picture-column shape
// (`{serverUrl, serverRelativeUrl}`, handled by parseThumbnailImage) or the modern Image-column
// shape (`{fileName: "Reserved_ImageAttachment_..."}`), whose file lives in AttachmentFiles under
// that exact name - so on the modern shape, resolve the URL by matching the reserved attachment.
// Falls back to the first real (non-reserved) attachment when the field has no value at all.
export function resolveImageColumnUrl(rawImageValue: string | undefined, attachmentFiles: IAttachmentFile[] | undefined): string {
  const legacyUrl = parseThumbnailImage(rawImageValue);
  if (legacyUrl) {
    return legacyUrl;
  }

  const attachments = attachmentFiles ?? [];
  let reservedFileName: string | undefined;
  if (rawImageValue) {
    try {
      reservedFileName = (JSON.parse(rawImageValue) as { fileName?: string }).fileName;
    } catch {
      reservedFileName = undefined;
    }
  }

  const reservedAttachment = reservedFileName
    ? attachments.find(file => getAttachmentFileName(file) === reservedFileName)
    : undefined;
  if (reservedAttachment) {
    return buildAttachmentUrl(reservedAttachment);
  }

  const firstRealAttachment = attachments.filter(file => !isReservedAttachment(file))[0];
  return firstRealAttachment ? buildAttachmentUrl(firstRealAttachment) : '';
}
