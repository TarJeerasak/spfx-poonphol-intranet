import { useEffect, useState } from 'react';
import { NewsItem } from '../../../shared/types/content';
import { fetchAllActiveNews } from '../services/newsService';

export interface UseAllNewsFeedResult {
  items: NewsItem[];
  isLoading: boolean;
  error: Error | undefined;
}

export function useAllNewsFeed(): UseAllNewsFeedResult {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchAllActiveNews()
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
