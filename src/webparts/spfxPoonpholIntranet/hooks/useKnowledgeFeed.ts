import { useEffect, useState } from 'react';
import { KnowledgeCategory, KnowledgeItem } from '../../../shared/types/content';
import { fetchKnowledgeFeed } from '../services/knowledgeService';

export interface UseKnowledgeFeedResult {
  items: KnowledgeItem[];
  categories: KnowledgeCategory[];
  totalCount: number;
  isLoading: boolean;
  error: Error | undefined;
}

export function useKnowledgeFeed(): UseKnowledgeFeedResult {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchKnowledgeFeed()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setItems(result.items);
        setCategories(result.categories);
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

  return { items, categories, totalCount, isLoading, error };
}
