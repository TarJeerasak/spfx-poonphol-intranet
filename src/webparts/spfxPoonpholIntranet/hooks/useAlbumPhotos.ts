import { useEffect, useState } from 'react';
import { fetchAlbumMediaItems, GalleryAlbumMediaItem } from '../services/galleryService';

export const ALBUM_CAROUSEL_PHOTO_COUNT = 5;

export interface UseAlbumPhotosResult {
  mediaItems: GalleryAlbumMediaItem[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useAlbumPhotos(folderUrl: string | undefined): UseAlbumPhotosResult {
  const [mediaItems, setMediaItems] = useState<GalleryAlbumMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(folderUrl));
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!folderUrl) {
      setMediaItems([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    fetchAlbumMediaItems(folderUrl)
      .then(result => {
        if (isCancelled) {
          return;
        }
        setMediaItems(result);
        setIsLoading(false);
      })
      .catch((fetchError: Error) => {
        if (isCancelled) {
          return;
        }
        setError(fetchError);
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [folderUrl]);

  return { mediaItems, isLoading, error };
}
