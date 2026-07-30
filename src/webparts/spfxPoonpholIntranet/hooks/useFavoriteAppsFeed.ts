import { useEffect, useState } from 'react';
import { FavoriteAppLink } from '../../../shared/types/content';
import { getCurrentUser } from '../../../shared/services/currentUser';
import { recordAppUsage } from '../services/appUsageService';
import { fetchFavoriteApps, mapToFavoriteAppLink } from '../services/favoriteAppsService';

export interface UseFavoriteAppsFeedResult {
  items: FavoriteAppLink[];
  recordUsage: (app: FavoriteAppLink) => void;
}

export function useFavoriteAppsFeed(): UseFavoriteAppsFeedResult {
  const [items, setItems] = useState<FavoriteAppLink[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;

    getCurrentUser()
      .then(user => {
        if (isCancelled) {
          return undefined;
        }
        setCurrentUserEmail(user.email);
        return fetchFavoriteApps(user.email);
      })
      .then(records => {
        if (!isCancelled && records) {
          setItems(records.map(mapToFavoriteAppLink));
        }
      })
      .catch(() => {
        // Leave the quick-app row empty if we can't determine the current user's favorites.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  function recordUsage(app: FavoriteAppLink): void {
    if (!currentUserEmail) {
      return;
    }

    recordAppUsage(app, currentUserEmail, new Date().toISOString()).catch(() => {
      // Usage tracking is best-effort and must never block opening the app.
    });
  }

  return { items, recordUsage };
}
