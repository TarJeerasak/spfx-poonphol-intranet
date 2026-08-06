import { spApi } from '../../../shared/services/api';
import { GalleryItem } from '../../../shared/types/content';
import { formatEnglishDateShort } from '../../../shared/utils/formatEnglishDateShort';
import { parseThumbnailImage } from '../../../shared/utils/parseThumbnailImage';
import { SITE_ORIGIN } from '../../../shared/utils/siteOrigin';
import { EventCategory, fetchEventCategories, resolveEventCategory } from './eventService';

const PHOTO_ALBUM_LIST_TITLE = 'PhotoAlbum';

// Internal names guessed from the list's display names shown in list settings - verify against
// `${SiteURL}/_api/web/lists/getbytitle('PhotoAlbum')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
// and adjust the constants below if a request returns a "field does not exist" error. "Image Cover"
// has a space in its display name, so its internal name most likely differs (commonly
// `Image_x0020_Cover` - SharePoint's usual space-to-`_x0020_` encoding).
// Gallery_Category is assumed to be a Lookup into the same Master_Category list Events uses
// (shows the Title field), so it needs $expand alongside a Gallery_Category/Title $select.
// FileSystemObjectType isn't selectable on this list (confirmed via a live 500 response - "Column
// 'FileSystemObjectType' does not exist"), so folders aren't distinguished from plain Document
// items server-side; Active eq 1 is the only filter, since every real album folder has it set.
const PHOTO_ALBUM_FIELDS = {
  id: 'Id',
  title: 'Title',
  imageCover: 'Image_x0020_Cover',
  eventDate: 'Event_Date',
  active: 'Active',
  category: 'Gallery_Category',
  fileRef: 'FileRef'
} as const;

const PHOTO_ALBUM_SELECT_FIELDS = [
  PHOTO_ALBUM_FIELDS.id,
  PHOTO_ALBUM_FIELDS.title,
  PHOTO_ALBUM_FIELDS.imageCover,
  PHOTO_ALBUM_FIELDS.eventDate,
  PHOTO_ALBUM_FIELDS.active,
  `${PHOTO_ALBUM_FIELDS.category}/Title`,
  PHOTO_ALBUM_FIELDS.fileRef
].join(',');

const PHOTO_ALBUM_EXPAND_FIELDS = PHOTO_ALBUM_FIELDS.category;

interface ISPPhotoAlbumItem {
  Id: number;
  Title: string;
  Image_x0020_Cover?: string;
  Event_Date?: string;
  Active: boolean;
  Gallery_Category?: { Title: string };
  FileRef?: string;
}

interface IFolderItemCountResponse {
  ItemCount: number;
}

// Each Photo Album is a folder in the document library, and its photos are the files inside -
// there's no dedicated count column, so this asks SharePoint for the folder's own item count.
// Counts every direct child (files and subfolders alike), so it may need revisiting if albums
// ever nest subfolders instead of storing photos directly inside the album folder.
async function fetchGalleryPhotoCounts(albums: ISPPhotoAlbumItem[]): Promise<Record<string, number>> {
  const folders = albums.filter(album => Boolean(album.FileRef));

  const counts = await Promise.all(
    folders.map(async album => {
      const response = await spApi.get<IFolderItemCountResponse>(
        `/GetFolderByServerRelativeUrl('${encodeURIComponent(album.FileRef as string)}')`,
        { params: { $select: 'ItemCount' } }
      );
      return [String(album.Id), response.data.ItemCount] as const;
    })
  );

  const photoCountByAlbumId: Record<string, number> = {};
  counts.forEach(([albumId, itemCount]) => {
    photoCountByAlbumId[albumId] = itemCount;
  });
  return photoCountByAlbumId;
}

export function mapToGalleryItem(raw: ISPPhotoAlbumItem, categories: EventCategory[], photoCount: number): GalleryItem {
  const category = resolveEventCategory(raw.Gallery_Category?.Title, categories);

  return {
    id: String(raw.Id),
    categoryId: category.id,
    categoryLabel: category.label,
    categoryColor: category.color,
    categoryTextColor: category.textColor,
    categoryBorderColor: category.borderColor,
    title: raw.Title,
    dateLabel: raw.Event_Date ? formatEnglishDateShort(new Date(raw.Event_Date)) : '',
    photoCount,
    imageUrl: parseThumbnailImage(raw.Image_x0020_Cover),
    folderUrl: raw.FileRef ?? ''
  };
}

export async function fetchActiveGalleryItems(): Promise<GalleryItem[]> {
  const [categories, response] = await Promise.all([
    fetchEventCategories(),
    spApi.get<{ value: ISPPhotoAlbumItem[] }>(`/lists/getbytitle('${PHOTO_ALBUM_LIST_TITLE}')/items`, {
      params: {
        $select: PHOTO_ALBUM_SELECT_FIELDS,
        $expand: PHOTO_ALBUM_EXPAND_FIELDS,
        $filter: `${PHOTO_ALBUM_FIELDS.active} eq 1`,
        $orderby: `${PHOTO_ALBUM_FIELDS.eventDate} desc`,
        $top: 5000
      }
    })
  ]);

  const albums = response.data.value;
  const photoCountByAlbumId = await fetchGalleryPhotoCounts(albums);

  return albums.map(album => mapToGalleryItem(album, categories, photoCountByAlbumId[String(album.Id)] ?? 0));
}

const IMAGE_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_FILE_EXTENSIONS = ['.mp4', '.mov', '.avi', '.wmv', '.m4v', '.webm'];

export function isImageFileName(fileName: string): boolean {
  const lowerCaseName = fileName.toLowerCase();
  return IMAGE_FILE_EXTENSIONS.some(extension => lowerCaseName.endsWith(extension));
}

export function isVideoFileName(fileName: string): boolean {
  const lowerCaseName = fileName.toLowerCase();
  return VIDEO_FILE_EXTENSIONS.some(extension => lowerCaseName.endsWith(extension));
}

interface ISPFolderFile {
  Name: string;
  ServerRelativeUrl: string;
}

export interface GalleryAlbumMediaItem {
  url: string;
  type: 'image' | 'video';
}

export async function fetchAlbumMediaItems(albumFolderUrl: string): Promise<GalleryAlbumMediaItem[]> {
  const response = await spApi.get<{ value: ISPFolderFile[] }>(
    `/GetFolderByServerRelativeUrl('${encodeURIComponent(albumFolderUrl)}')/Files`,
    { params: { $select: 'Name,ServerRelativeUrl', $orderby: 'Name asc', $top: 5000 } }
  );

  return response.data.value
    .filter(file => isImageFileName(file.Name) || isVideoFileName(file.Name))
    .map(file => ({
      // Album folder/file names are free-text event names and often contain spaces (e.g. "PPG
      // TOWNHALL -HALL 2024"), which SharePoint returns unescaped in ServerRelativeUrl - encodeURI
      // so the result is safe to interpolate into a CSS `url(...)` value or a <video> src.
      url: encodeURI(`${SITE_ORIGIN}${file.ServerRelativeUrl}`),
      type: isImageFileName(file.Name) ? ('image' as const) : ('video' as const)
    }));
}
