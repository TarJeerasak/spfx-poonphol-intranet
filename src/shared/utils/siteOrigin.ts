import { SiteURL } from '../config/site';

export function getSiteOrigin(siteUrl: string): string {
  const protocolSeparatorIndex = siteUrl.indexOf('://');
  const hostEndIndex = siteUrl.indexOf('/', protocolSeparatorIndex + 3);
  return hostEndIndex === -1 ? siteUrl : siteUrl.slice(0, hostEndIndex);
}

export const SITE_ORIGIN = getSiteOrigin(SiteURL);
