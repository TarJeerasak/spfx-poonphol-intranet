import { spApi } from '../../../shared/services/api';
import { EventItem } from '../../../shared/types/content';
import { formatThaiDayAndMonth } from '../../../shared/utils/formatThaiDayAndMonth';
import { formatTimeRange } from '../../../shared/utils/formatTimeRange';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';

const CALENDAR_LIST_TITLE = 'CalendarList';
export const MAX_FEATURED_EVENT_COUNT = 4;

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('CalendarList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
const EVENT_FIELDS = {
  id: 'Id',
  title: 'Title',
  image: 'Image',
  category: 'Category',
  dateFrom: 'DateFrom',
  dateTo: 'DateTo',
  active: 'Active'
} as const;

interface ISPCalendarListItem {
  Id: number;
  Title: string;
  Image?: string;
  Category?: { Title: string };
  DateFrom?: string;
  DateTo?: string;
  Active: boolean;
}

export interface EventFeedResult {
  feature: EventItem | undefined;
  items: EventItem[];
  totalCount: number;
}

export function mapToEventItem(raw: ISPCalendarListItem): EventItem {
  const { day, monthLabel } = raw.DateFrom ? formatThaiDayAndMonth(new Date(raw.DateFrom)) : { day: '', monthLabel: '' };

  return {
    id: String(raw.Id),
    title: raw.Title,
    dateDay: day,
    dateMonthLabel: monthLabel,
    timeLabel: formatTimeRange(raw.DateFrom, raw.DateTo),
    locationLabel: raw.Category?.Title ?? '',
    imageUrl: parseThumbnailImage(raw.Image),
    attendeeAvatarUrls: [],
    overflowCount: 0
  };
}

export function selectEventItemsByClosestDateFrom(
  activeItems: ISPCalendarListItem[],
  now: number,
  maxCount: number = MAX_FEATURED_EVENT_COUNT
): ISPCalendarListItem[] {
  return selectClosestByDate(activeItems, item => item.DateFrom, now, maxCount);
}

export async function fetchEventFeed(): Promise<EventFeedResult> {
  const response = await spApi.get<{ value: ISPCalendarListItem[] }>(
    `/lists/getbytitle('${CALENDAR_LIST_TITLE}')/items`,
    {
      params: {
        $select: [
          EVENT_FIELDS.id,
          EVENT_FIELDS.title,
          EVENT_FIELDS.image,
          `${EVENT_FIELDS.category}/Title`,
          EVENT_FIELDS.dateFrom,
          EVENT_FIELDS.dateTo,
          EVENT_FIELDS.active
        ].join(','),
        $expand: EVENT_FIELDS.category,
        $filter: `${EVENT_FIELDS.active} eq 1`,
        $top: 5000
      }
    }
  );

  const activeItems = response.data.value;
  const topItems = selectEventItemsByClosestDateFrom(activeItems, Date.now()).map(mapToEventItem);

  return {
    feature: topItems[0],
    items: topItems.slice(1),
    totalCount: activeItems.length
  };
}
