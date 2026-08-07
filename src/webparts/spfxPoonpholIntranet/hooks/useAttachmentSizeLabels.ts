import { useEffect, useState } from 'react';
import { fetchFileSizeInBytes } from '../../../shared/services/fileService';
import { KnowledgeAttachment } from '../../../shared/types/content';
import { formatFileSizeLabel } from '../../../shared/utils/formatFileSizeLabel';

// Attachment file size isn't in the list feed at all (SP.Attachment has no Length property), so
// it's looked up lazily, one small GetFileByServerRelativeUrl call per attachment actually shown
// on the detail page - never for the whole feed, where it would be an expensive N+1 fetch.
export function useAttachmentSizeLabels(attachments: KnowledgeAttachment[]): Record<string, string> {
  const [sizeLabelByUrl, setSizeLabelByUrl] = useState<Record<string, string>>({});
  const attachmentsKey = attachments.map(attachment => attachment.url).join(',');

  useEffect(() => {
    let isCancelled = false;

    attachments.forEach(attachment => {
      fetchFileSizeInBytes(attachment.serverRelativeUrl)
        .then(bytes => {
          if (!isCancelled) {
            setSizeLabelByUrl(current => ({ ...current, [attachment.url]: formatFileSizeLabel(bytes) }));
          }
        })
        .catch(() => {
          // File size is a non-critical enhancement - just omit it if the lookup fails.
        });
    });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachmentsKey]);

  return sizeLabelByUrl;
}
