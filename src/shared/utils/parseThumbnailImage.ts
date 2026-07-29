interface IThumbnailFieldValue {
  serverUrl?: string;
  serverRelativeUrl?: string;
}

export function parseThumbnailImage(rawValue: string | undefined): string {
  if (!rawValue) {
    return '';
  }

  try {
    const parsed: IThumbnailFieldValue = JSON.parse(rawValue);
    if (!parsed.serverRelativeUrl) {
      return '';
    }

    return parsed.serverUrl ? `${parsed.serverUrl}${parsed.serverRelativeUrl}` : parsed.serverRelativeUrl;
  } catch {
    return '';
  }
}
