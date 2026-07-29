import { spApi } from '../../../shared/services/api';
import { EventItem } from '../../../shared/types/content';
import { formatThaiDayAndMonth } from '../../../shared/utils/formatThaiDayAndMonth';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { stripHtml } from '../../../shared/utils/stripHtml';
import { fetchEventAttendees } from './eventJoinService';

const CALENDAR_LIST_TITLE = 'CalendarList';
export const MAX_FEATURED_EVENT_COUNT = 4;

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('CalendarList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
const EVENT_FIELDS = {
  id: 'Id',
  title: 'Title',
  shortDescription: 'ShortDescription',
  image: 'Image',
  location: 'Location',
  time: 'Time',
  dateFrom: 'DateFrom',
  active: 'Active',
  joinCount: 'JoinCount'
} as const;

interface ISPCalendarListItem {
  Id: number;
  Title: string;
  ShortDescription?: string;
  Image?: string;
  Location?: string;
  Time?: string;
  DateFrom?: string;
  Active: boolean;
  JoinCount?: number;
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
    subtitle: raw.ShortDescription ? stripHtml(raw.ShortDescription) : '',
    dateDay: day,
    dateMonthLabel: monthLabel,
    timeLabel: raw.Time ?? '',
    locationLabel: raw.Location ?? '',
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
          EVENT_FIELDS.shortDescription,
          EVENT_FIELDS.image,
          EVENT_FIELDS.location,
          EVENT_FIELDS.time,
          EVENT_FIELDS.dateFrom,
          EVENT_FIELDS.active,
          EVENT_FIELDS.joinCount
        ].join(','),
        $filter: `${EVENT_FIELDS.active} eq 1`,
        $top: 5000
      }
    }
  );

  const activeItems = response.data.value;
  const topRawItems = selectEventItemsByClosestDateFrom(activeItems, Date.now());
  const topItems = topRawItems.map(mapToEventItem);

  const joinCountByEventId: Record<string, number> = {};
  topRawItems.forEach(raw => {
    joinCountByEventId[String(raw.Id)] = raw.JoinCount ?? 0;
  });

  const attendeesByEventId = await fetchEventAttendees(topItems.map(item => item.id), joinCountByEventId);
  const enrichedItems = topItems.map(item => ({
    ...item,
    attendeeAvatarUrls: attendeesByEventId[item.id]?.attendeeAvatarUrls ?? [],
    overflowCount: attendeesByEventId[item.id]?.overflowCount ?? 0
  }));

  return {
    feature: enrichedItems[0],
    items: enrichedItems.slice(1),
    totalCount: activeItems.length
  };
}
