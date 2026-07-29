function distanceFromNow(dateValue: string | undefined, now: number): number {
  return dateValue ? Math.abs(new Date(dateValue).getTime() - now) : Number.MAX_SAFE_INTEGER;
}

export function selectClosestByDate<T>(
  items: T[],
  getDateValue: (item: T) => string | undefined,
  now: number,
  maxCount: number
): T[] {
  return [...items]
    .sort((a, b) => distanceFromNow(getDateValue(a), now) - distanceFromNow(getDateValue(b), now))
    .slice(0, maxCount);
}
