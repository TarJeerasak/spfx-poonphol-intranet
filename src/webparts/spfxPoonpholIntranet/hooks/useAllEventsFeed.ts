import { useEffect, useState } from 'react';
import { EventItem } from '../../../shared/types/content';
import { fetchAllActiveEvents } from '../services/eventService';

export interface UseAllEventsFeedResult {
  items: EventItem[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useAllEventsFeed(): UseAllEventsFeedResult {
  const [items, setItems] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchAllActiveEvents()
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
