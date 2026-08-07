import { useEffect, useState } from 'react';
import { Announcement } from '../../../shared/types/content';
import { fetchAllActiveAnnouncements } from '../services/announcementService';

export interface UseAllAnnouncementsFeedResult {
  items: Announcement[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useAllAnnouncementsFeed(): UseAllAnnouncementsFeedResult {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchAllActiveAnnouncements()
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
