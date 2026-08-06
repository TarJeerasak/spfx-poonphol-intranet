import { useEffect, useState } from 'react';
import { GalleryItem } from '../../../shared/types/content';
import { fetchActiveGalleryItems } from '../services/galleryService';

export interface UseGalleryFeedResult {
  items: GalleryItem[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useGalleryFeed(): UseGalleryFeedResult {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchActiveGalleryItems()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setItems(result);
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
  }, []);

  return { items, isLoading, error };
}
