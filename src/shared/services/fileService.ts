import { spApi } from './api';

// SP.Attachment (the AttachmentFiles collection) doesn't expose file size - only the underlying
// SP.File resource does, via a separate GetFileByServerRelativeUrl lookup.
export async function fetchFileSizeInBytes(serverRelativeUrl: string): Promise<number> {
  const response = await spApi.get<{ Length: string | number }>(
    `/GetFileByServerRelativeUrl('${encodeURIComponent(serverRelativeUrl)}')`,
    { params: { $select: 'Length' } }
  );

  return Number(response.data.Length);
}
