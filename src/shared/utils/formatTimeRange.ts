function pad(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTimeRange(dateFrom: string | undefined, dateTo: string | undefined): string {
  if (!dateFrom || !dateTo) {
    return '';
  }

  return `${formatTime(new Date(dateFrom))} - ${formatTime(new Date(dateTo))}`;
}
