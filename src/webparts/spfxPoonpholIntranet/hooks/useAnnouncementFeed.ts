import { useEffect, useState } from 'react';
import { Announcement } from '../../../shared/types/content';
import { fetchAnnouncementFeed } from '../services/announcementService';

export interface UseAnnouncementFeedResult {
  items: Announcement[];
  totalCount: number;
  isLoading: boolean;
  error: Error | undefined;
}

export function useAnnouncementFeed(): UseAnnouncementFeedResult {
  const [items, setItems] = useState<Announcement[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchAnnouncementFeed()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setItems(result.items);
        setTotalCount(result.totalCount);
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

  return { items, totalCount, isLoading, error };
}
