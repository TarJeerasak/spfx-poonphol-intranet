// SharePoint's pageContext.user.displayName is often "FirstName LastName [Nickname]" -
// the Hero greeting only wants the first name.
export function getFirstName(displayName: string): string {
  const withoutNickname = displayName.replace(/\s*\[.*?\]\s*$/, '');
  return withoutNickname.trim().split(/\s+/)[0] ?? '';
}
