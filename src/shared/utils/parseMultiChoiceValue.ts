export function parseMultiChoiceValue(rawValue: string[] | string | undefined): string[] {
  if (!rawValue) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue.filter(Boolean);
  }

  return rawValue
    .split(';')
    .map(value => value.trim())
    .filter(Boolean);
}
