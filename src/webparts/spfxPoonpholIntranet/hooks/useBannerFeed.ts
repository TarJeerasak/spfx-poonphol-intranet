import { useEffect, useState } from 'react';
import { HeroBanner } from '../../../shared/types/content';
import { fetchBannerFeed } from '../services/bannerService';

export interface UseBannerFeedResult {
  banner: HeroBanner | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

export function useBannerFeed(): UseBannerFeedResult {
  const [banner, setBanner] = useState<HeroBanner | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    fetchBannerFeed()
      .then(result => {
        if (isCancelled) {
          return;
        }
        setBanner(result.banner);
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

  return { banner, isLoading, error };
}
