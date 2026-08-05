export interface DescriptionSegment {
  type: 'text' | 'link';
  value: string;
  href?: string;
}

const ANCHOR_TAG_PATTERN = /<a\s+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
const SAFE_HREF_PATTERN = /^https?:\/\//i;

// Some KM entries store a raw `<a href="...">label</a>` tag inside the plain-text Description
// field. We deliberately avoid dangerouslySetInnerHTML here - this only ever recognizes that one
// narrow anchor-tag shape and renders it as a real link; anything else (including a tag with an
// unsafe href like `javascript:`) is kept as literal, auto-escaped text.
export function parseDescriptionSegments(description: string): DescriptionSegment[] {
  const segments: DescriptionSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  ANCHOR_TAG_PATTERN.lastIndex = 0;
  while ((match = ANCHOR_TAG_PATTERN.exec(description)) !== null) {
    const [fullMatch, href, label] = match;

    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: description.slice(lastIndex, match.index) });
    }

    segments.push(SAFE_HREF_PATTERN.test(href) ? { type: 'link', value: label, href } : { type: 'text', value: fullMatch });

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < description.length) {
    segments.push({ type: 'text', value: description.slice(lastIndex) });
  }

  return segments;
}
