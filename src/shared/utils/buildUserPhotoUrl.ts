import { SITE_ORIGIN } from './siteOrigin';

export type UserPhotoSize = 'S' | 'M' | 'L';

// Uses SharePoint's built-in profile photo endpoint so an author's avatar can be shown
// without a separate User Profile / PeopleManager API call or extra permissions.
export function buildUserPhotoUrl(email: string | undefined, size: UserPhotoSize = 'M'): string {
  if (!email) {
    return '';
  }

  return `${SITE_ORIGIN}/_layouts/15/userphoto.aspx?size=${size}&accountname=${encodeURIComponent(email)}`;
}
