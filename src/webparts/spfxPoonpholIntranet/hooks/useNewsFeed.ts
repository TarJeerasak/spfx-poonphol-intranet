import { useEffect, useState } from 'react';
import { NewsItem } from '../../../shared/types/content';
import { fetchNewsFeed } from '../services/newsService';

export interface UseNewsFeedResult {
  feature: NewsItem | undefined;
  items: NewsItem[];
  totalCount: number;
  isLoading: boolean;
  error: Error | undefined;
}

export function useNewsFeed(): UseNewsFeedResult {
  const [feature, setFeature] = useState<NewsItem | undefined>(undefined);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchNewsFeed()
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
