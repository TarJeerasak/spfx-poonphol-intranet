import { useEffect, useState } from 'react';
import { EventItem } from '../../../shared/types/content';
import { fetchEventFeed } from '../services/eventService';

export interface UseEventFeedResult {
  feature: EventItem | undefined;
  items: EventItem[];
  totalCount: number;
  isLoading: boolean;
  error: Error | undefined;
}

export function useEventFeed(): UseEventFeedResult {
  const [feature, setFeature] = useState<EventItem | undefined>(undefined);
  const [items, setItems] = useState<EventItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchEventFeed()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setFeature(result.feature);
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

  return { feature, items, totalCount, isLoading, error };
}
