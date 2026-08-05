import { spApi } from '../../../shared/services/api';
import { EventItem } from '../../../shared/types/content';
import { formatThaiDayAndMonth } from '../../../shared/utils/formatThaiDayAndMonth';
import { lightenHexColor } from '../../../shared/utils/lightenHexColor';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { selectClosestByDate } from '../../../shared/utils/selectClosestByDate';
import { stripHtml } from '../../../shared/utils/stripHtml';
import { fetchEventAttendees } from './eventJoinService';

const CALENDAR_LIST_TITLE = 'CalendarList';
const MASTER_CATEGORY_LIST_TITLE = 'Master_Category';
export const MAX_FEATURED_EVENT_COUNT = 4;

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('CalendarList')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
// Category is a Lookup column (shows the Title field of Master_Category), so it needs
// $expand alongside a Category/Title $select instead of a plain field name.
const EVENT_FIELDS = {
  id: 'Id',
  title: 'Title',
  shortDescription: 'ShortDescription',
  image: 'Image',
  location: 'Location',
  time: 'Time',
  dateFrom: 'DateFrom',
  active: 'Active',
  joinCount: 'JoinCount',
  category: 'Category'
} as const;

const EVENT_SELECT_FIELDS = [
  EVENT_FIELDS.id,
  EVENT_FIELDS.title,
  EVENT_FIELDS.shortDescription,
  EVENT_FIELDS.image,
  EVENT_FIELDS.location,
  EVENT_FIELDS.time,
  EVENT_FIELDS.dateFrom,
  EVENT_FIELDS.active,
  EVENT_FIELDS.joinCount,
  `${EVENT_FIELDS.category}/Title`
].join(',');

const EVENT_EXPAND_FIELDS = EVENT_FIELDS.category;

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
  Category?: { Title: string };
}

export interface EventFeedResult {
  feature: EventItem | undefined;
  items: EventItem[];
  totalCount: number;
}

export interface EventCategory {
  id: string;
  label: string;
  color: string;
  textColor: string;
  borderColor: string;
}

// Master_Category's Color column holds a hex accent color (e.g. "#3992F6") - it's used as the tag's
// text/border color as-is, and tinted toward white for the tag background so it stays in line with
// the app's pale, pastel tag style instead of the raw, fully-saturated color.
const CATEGORY_BACKGROUND_TINT_AMOUNT = 0.88;
const FALLBACK_CATEGORY_ACCENT_COLOR = '#66756f';

const DEFAULT_EVENT_CATEGORY: EventCategory = {
  id: 'other',
  label: 'อื่นๆ',
  color: lightenHexColor(FALLBACK_CATEGORY_ACCENT_COLOR, CATEGORY_BACKGROUND_TINT_AMOUNT),
  textColor: FALLBACK_CATEGORY_ACCENT_COLOR,
  borderColor: FALLBACK_CATEGORY_ACCENT_COLOR
};

export async function fetchEventCategories(): Promise<EventCategory[]> {
  const response = await spApi.get<{ value: { Id: number; Title: string; Color?: string }[] }>(
    `/lists/getbytitle('${MASTER_CATEGORY_LIST_TITLE}')/items`,
    {
      params: {
        $select: 'Id,Title,Color',
        $orderby: 'Id asc',
        $top: 5000
      }
    }
  );

  return response.data.value.map(item => {
    const accentColor = item.Color?.trim() || FALLBACK_CATEGORY_ACCENT_COLOR;

    return {
      id: String(item.Id),
      label: item.Title,
      color: lightenHexColor(accentColor, CATEGORY_BACKGROUND_TINT_AMOUNT),
      textColor: accentColor,
      borderColor: accentColor
    };
  });
}

export function resolveEventCategory(rawCategory: string | undefined, categories: EventCategory[]): EventCategory {
  const match = categories.find(category => category.label === rawCategory?.trim());
  return match ?? categories[0] ?? DEFAULT_EVENT_CATEGORY;
}

export function mapToEventItem(raw: ISPCalendarListItem, categories: EventCategory[]): EventItem {
  const { day, monthLabel } = raw.DateFrom ? formatThaiDayAndMonth(new Date(raw.DateFrom)) : { day: '', monthLabel: '' };
  const category = resolveEventCategory(raw.Category?.Title, categories);

  return {
    id: String(raw.Id),
    categoryId: category.id,
    categoryLabel: category.label,
    categoryColor: category.color,
    categoryTextColor: category.textColor,
    categoryBorderColor: category.borderColor,
    title: raw.Title,
    subtitle: raw.ShortDescription ? stripHtml(raw.ShortDescription) : '',
    dateDay: day,
    dateMonthLabel: monthLabel,
    dateFromIso: raw.DateFrom ?? '',
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
  const [categories, response] = await Promise.all([
    fetchEventCategories(),
    spApi.get<{ value: ISPCalendarListItem[] }>(`/lists/getbytitle('${CALENDAR_LIST_TITLE}')/items`, {
      params: {
        $select: EVENT_SELECT_FIELDS,
        $expand: EVENT_EXPAND_FIELDS,
        $filter: `${EVENT_FIELDS.active} eq 1`,
        $top: 5000
      }
    })
  ]);

  const activeItems = response.data.value;
  const topRawItems = selectEventItemsByClosestDateFrom(activeItems, Date.now());
  const topItems = topRawItems.map(raw => mapToEventItem(raw, categories));

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

export async function fetchAllActiveEvents(): Promise<EventItem[]> {
  const [categories, response] = await Promise.all([
    fetchEventCategories(),
    spApi.get<{ value: ISPCalendarListItem[] }>(`/lists/getbytitle('${CALENDAR_LIST_TITLE}')/items`, {
      params: {
        $select: EVENT_SELECT_FIELDS,
        $expand: EVENT_EXPAND_FIELDS,
        $filter: `${EVENT_FIELDS.active} eq 1`,
        $orderby: `${EVENT_FIELDS.dateFrom} desc`,
        $top: 5000
      }
    })
  ]);

  return response.data.value.map(raw => mapToEventItem(raw, categories));
}
