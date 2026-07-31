import { useEffect, useState } from 'react';
import { KnowledgeCategory, KnowledgeItem } from '../../../shared/types/content';
import { getCurrentUser } from '../../../shared/services/currentUser';
import { fetchKnowledgeFeed } from '../services/knowledgeService';
import { recordKnowledgeRead } from '../services/knowledgeReadService';

export interface UseKnowledgeFeedResult {
  items: KnowledgeItem[];
  featuredItems: KnowledgeItem[];
  categories: KnowledgeCategory[];
  totalCount: number;
  isLoading: boolean;
  error: Error | undefined;
  recordRead: (itemId: string) => void;
}

function applyReadCount(items: KnowledgeItem[], itemId: string, readCount: number): KnowledgeItem[] {
  return items.map(item => (item.id === itemId ? { ...item, readCount } : item));
}

export function useKnowledgeFeed(): UseKnowledgeFeedResult {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    getCurrentUser()
      .then(user => {
        if (!isCancelled) {
          setCurrentUserEmail(user.email);
        }
      })
      .catch(() => {
        // Read tracking is best-effort and must never block rendering the feed.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchKnowledgeFeed()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setItems(result.items);
        setFeaturedItems(result.featuredItems);
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

  async function recordRead(itemId: string): Promise<void> {
    if (!currentUserEmail) {
      return;
    }

    const item = items.find(candidate => candidate.id === itemId);
    if (!item) {
      return;
    }

    const nextReadCount = await recordKnowledgeRead(itemId, currentUserEmail, item.readCount);

    setItems(current => applyReadCount(current, itemId, nextReadCount));
    setFeaturedItems(current => applyReadCount(current, itemId, nextReadCount));
  }

  return {
    items,
    featuredItems,
    categories,
    totalCount,
    isLoading,
    error,
    recordRead: itemId => {
      recordRead(itemId).catch(() => {
        // Read tracking is best-effort and must never block the reading experience.
      });
    }
  };
}
