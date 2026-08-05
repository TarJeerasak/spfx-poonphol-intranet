import { useEffect, useState } from 'react';
import { KnowledgeItem } from '../../../shared/types/content';
import { getCurrentUser } from '../../../shared/services/currentUser';
import { fetchLikedKnowledgeMap, likeKnowledgeItem, unlikeKnowledgeItem } from '../services/knowledgeLikeService';

export interface KnowledgeLikeState {
  isLiked: boolean;
  likeCount: number;
  isSaving: boolean;
}

export interface UseKnowledgeLikesResult {
  currentUserEmail: string | undefined;
  getLikeState: (item: KnowledgeItem) => KnowledgeLikeState;
  toggleLike: (item: KnowledgeItem) => void;
}

// Used to mark an item as liked in local state before the create request returns its real
// History_KM_Like item id - only ever checked for presence via the `in` operator, never read.
const PENDING_HISTORY_ITEM_ID = -1;

export function useKnowledgeLikes(items: KnowledgeItem[]): UseKnowledgeLikesResult {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [likedItemIdByKmId, setLikedItemIdByKmId] = useState<Record<string, number>>({});
  const [likeCountByKmId, setLikeCountByKmId] = useState<Record<string, number>>({});
  const [savingKmIds, setSavingKmIds] = useState<Record<string, boolean>>({});

  const itemIdsKey = items.map(item => item.id).join(',');

  useEffect(() => {
    setLikeCountByKmId(current => {
      const next = { ...current };
      items.forEach(item => {
        if (!(item.id in next)) {
          next[item.id] = item.likeCount;
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdsKey]);

  useEffect(() => {
    if (!itemIdsKey) {
      return undefined;
    }

    let isCancelled = false;

    getCurrentUser()
      .then(user => {
        if (isCancelled) {
          return undefined;
        }
        setCurrentUserEmail(user.email);
        return fetchLikedKnowledgeMap(user.email);
      })
      .then(likedKnowledgeMap => {
        if (!isCancelled && likedKnowledgeMap) {
          setLikedItemIdByKmId(likedKnowledgeMap);
        }
      })
      .catch(() => {
        // Leave items unmarked as liked if we can't determine the current user's like history.
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdsKey]);

  function getLikeState(item: KnowledgeItem): KnowledgeLikeState {
    return {
      isLiked: item.id in likedItemIdByKmId,
      likeCount: likeCountByKmId[item.id] ?? item.likeCount,
      isSaving: !!savingKmIds[item.id]
    };
  }

  // Optimistic: the heart and count flip immediately on click, before the SharePoint round trip
  // resolves - the write happens in the background and rolls the UI back if it fails.
  async function toggleLike(item: KnowledgeItem): Promise<void> {
    if (!currentUserEmail || savingKmIds[item.id]) {
      return;
    }

    const wasLiked = item.id in likedItemIdByKmId;
    const previousHistoryItemId = likedItemIdByKmId[item.id];
    const previousCount = likeCountByKmId[item.id] ?? item.likeCount;
    const nextCount = wasLiked ? Math.max(0, previousCount - 1) : previousCount + 1;

    setSavingKmIds(current => ({ ...current, [item.id]: true }));
    setLikedItemIdByKmId(current => {
      const next = { ...current };
      if (wasLiked) {
        delete next[item.id];
      } else {
        next[item.id] = PENDING_HISTORY_ITEM_ID;
      }
      return next;
    });
    setLikeCountByKmId(current => ({ ...current, [item.id]: nextCount }));

    try {
      if (wasLiked) {
        await unlikeKnowledgeItem(previousHistoryItemId, item.id, previousCount);
      } else {
        const historyItemId = await likeKnowledgeItem(item.id, currentUserEmail, previousCount);
        setLikedItemIdByKmId(current => ({ ...current, [item.id]: historyItemId }));
      }
    } catch (error) {
      setLikedItemIdByKmId(current => {
        const next = { ...current };
        if (wasLiked) {
          next[item.id] = previousHistoryItemId;
        } else {
          delete next[item.id];
        }
        return next;
      });
      setLikeCountByKmId(current => ({ ...current, [item.id]: previousCount }));
      throw error;
    } finally {
      setSavingKmIds(current => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
    }
  }

  return { currentUserEmail, getLikeState, toggleLike };
}
