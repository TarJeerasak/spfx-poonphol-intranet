import { useEffect, useState } from 'react';
import { EventCategory, fetchEventCategories } from '../services/eventService';

export interface UseEventCategoriesResult {
  categories: EventCategory[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useEventCategories(): UseEventCategoriesResult {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchEventCategories()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setCategories(result);
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

  return { categories, isLoading, error };
}
