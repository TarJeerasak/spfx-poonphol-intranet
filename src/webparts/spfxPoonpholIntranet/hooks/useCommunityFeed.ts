import { useCallback, useEffect, useState } from 'react';
import { CommunityPost } from '../../../shared/types/content';
import { fetchCommunityFeed } from '../services/communityService';

export interface UseCommunityFeedResult {
  posts: CommunityPost[];
  totalCount: number;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export function useCommunityFeed(): UseCommunityFeedResult {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [refetchToken, setRefetchToken] = useState<number>(0);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetchCommunityFeed()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setPosts(result.posts);
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
  }, [refetchToken]);

  const refetch = useCallback(() => {
    setRefetchToken(current => current + 1);
  }, []);

  return { posts, totalCount, isLoading, error, refetch };
}
