import { EventCategory } from './eventService';
import { isImageFileName, isVideoFileName, mapToGalleryItem } from './galleryService';

const CATEGORIES: EventCategory[] = [
  { id: '3', label: 'กิจกรรมบริษัท', color: '#e0fff2', textColor: '#0e5536', borderColor: '#0e5536' },
  { id: '2', label: 'อบรมและสัมมนา', color: '#d8e8ff', textColor: '#116ffb', borderColor: '#116ffb' },
  { id: '1', label: 'CSR', color: '#dcbcff', textColor: '#3d0e70', borderColor: '#3d0e70' }
];

describe('mapToGalleryItem', () => {
  it('maps a PhotoAlbum item to the GalleryItem shape used by the UI', () => {
    const raw = {
      Id: 21,
      Title: 'อบรมหลักสูตร Leadership Development Program',
      Image_x0020_Cover: JSON.stringify({
        serverUrl: 'https://poonphol.sharepoint.com',
        serverRelativeUrl: '/sites/PPG_UAT/PhotoAlbum/Leadership/cover.jpg'
      }),
      Event_Date: '2022-12-02T00:00:00',
      Active: true,
      Gallery_Category: { Title: 'CSR' },
      FileRef: '/sites/PPG_UAT/PhotoAlbum/Leadership'
    };

    expect(mapToGalleryItem(raw, CATEGORIES, 10)).toEqual({
      id: '21',
      categoryId: '1',
      categoryLabel: 'CSR',
      categoryColor: '#dcbcff',
      categoryTextColor: '#3d0e70',
      categoryBorderColor: '#3d0e70',
      title: 'อบรมหลักสูตร Leadership Development Program',
      dateLabel: '02 Dec 2022',
      photoCount: 10,
      imageUrl: 'https://poonphol.sharepoint.com/sites/PPG_UAT/PhotoAlbum/Leadership/cover.jpg',
      folderUrl: '/sites/PPG_UAT/PhotoAlbum/Leadership'
    });
  });

  it('falls back to empty date label and image url when the item has no Event_Date or cover image', () => {
    const raw = {
      Id: 22,
      Title: 'No cover yet',
      Active: true
    };

    expect(mapToGalleryItem(raw, CATEGORIES, 0)).toEqual({
      id: '22',
      categoryId: '3',
      categoryLabel: 'กิจกรรมบริษัท',
      categoryColor: '#e0fff2',
      categoryTextColor: '#0e5536',
      categoryBorderColor: '#0e5536',
      title: 'No cover yet',
      dateLabel: '',
      photoCount: 0,
      imageUrl: '',
      folderUrl: ''
    });
  });
});

describe('isImageFileName', () => {
  it('accepts common image extensions regardless of case', () => {
    expect(isImageFileName('IMG_8576.JPG')).toBe(true);
    expect(isImageFileName('cover.png')).toBe(true);
    expect(isImageFileName('photo.webp')).toBe(true);
  });

  it('rejects non-image files such as videos or documents', () => {
    expect(isImageFileName('Intranet Phase 2 - Discuss Requirement.mp4')).toBe(false);
    expect(isImageFileName('agenda.docx')).toBe(false);
  });
});

describe('isVideoFileName', () => {
  it('accepts common video extensions regardless of case', () => {
    expect(isVideoFileName('Intranet Phase 2 - Discuss Requirement.MP4')).toBe(true);
    expect(isVideoFileName('recording.mov')).toBe(true);
    expect(isVideoFileName('clip.webm')).toBe(true);
  });

  it('rejects non-video files such as images or documents', () => {
    expect(isVideoFileName('IMG_8576.JPG')).toBe(false);
    expect(isVideoFileName('agenda.docx')).toBe(false);
  });
});
