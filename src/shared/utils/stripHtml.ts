const HTML_ENTITIES: { [entity: string]: string } = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};

function decodeHtmlEntities(text: string): string {
  return text.replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, entity => HTML_ENTITIES[entity]);
}

export function stripHtml(html: string): string {
  const withLineBreaks = html.replace(/<\/(p|div|li)>|<br\s*\/?>/gi, '\n');
  const withoutTags = withLineBreaks.replace(/<[^>]+>/g, '');

  return decodeHtmlEntities(withoutTags)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');
}
