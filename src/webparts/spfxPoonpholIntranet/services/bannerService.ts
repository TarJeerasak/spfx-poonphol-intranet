import { spApi } from '../../../shared/services/api';
import { HeroBanner } from '../../../shared/types/content';
import { toIsoDate } from '../../../shared/utils/isoDate';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';

const BANNER_LIST_TITLE = 'BannerHome';

export const DISPLAY_TIME = {
  festival: 'เทศกาล',
  morning: 'เช้า',
  afternoon: 'บ่าย',
  evening: 'เย็น'
} as const;

export type DisplayTimeValue = (typeof DISPLAY_TIME)[keyof typeof DISPLAY_TIME];

// Internal names guessed from the list's display names - verify against
// `${SiteURL}/_api/web/lists/getbytitle('BannerHome')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if the request returns a "field does not exist" error.
const BANNER_FIELDS = {
  id: 'Id',
  title: 'Title',
  thumbnailImage: 'ThumbnailImage',
  publishDate: 'PublishDate',
  displayTime: 'Display_Time'
} as const;

interface ISPBannerListItem {
  Id: number;
  Title?: string;
  ThumbnailImage?: string;
  PublishDate?: string;
  Display_Time?: string;
}

export interface BannerFeedResult {
  banner: HeroBanner | undefined;
}

export function getCurrentDisplayTimePeriod(now: Date): DisplayTimeValue {
  const hour = now.getHours();

  if (hour >= 6 && hour < 12) {
    return DISPLAY_TIME.morning;
  }
  if (hour >= 12 && hour < 17) {
    return DISPLAY_TIME.afternoon;
  }
  return DISPLAY_TIME.evening;
}

export function selectBannerItem(items: ISPBannerListItem[], now: Date): ISPBannerListItem | undefined {
  const today = toIsoDate(now);
  const todaysFestivalItem = items.find(
    item => item.Display_Time === DISPLAY_TIME.festival && !!item.PublishDate && toIsoDate(new Date(item.PublishDate)) === today
  );
  if (todaysFestivalItem) {
    return todaysFestivalItem;
  }

  const currentPeriod = getCurrentDisplayTimePeriod(now);
  return items.find(item => item.Display_Time === currentPeriod);
}

export function mapToHeroBanner(raw: ISPBannerListItem): HeroBanner {
  return {
    id: String(raw.Id),
    title: raw.Title ?? '',
    imageUrl: parseThumbnailImage(raw.ThumbnailImage)
  };
}

export async function fetchBannerFeed(): Promise<BannerFeedResult> {
  const response = await spApi.get<{ value: ISPBannerListItem[] }>(`/lists/getbytitle('${BANNER_LIST_TITLE}')/items`, {
    params: {
      $select: [
        BANNER_FIELDS.id,
        BANNER_FIELDS.title,
        BANNER_FIELDS.thumbnailImage,
        BANNER_FIELDS.publishDate,
        BANNER_FIELDS.displayTime
      ].join(','),
      $top: 5000
    }
  });

  const selected = selectBannerItem(response.data.value, new Date());

  return {
    banner: selected ? mapToHeroBanner(selected) : undefined
  };
}
