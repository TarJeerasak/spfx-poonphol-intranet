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

  async function toggleLike(item: KnowledgeItem): Promise<void> {
    if (!currentUserEmail || savingKmIds[item.id]) {
      return;
    }

    const isLiked = item.id in likedItemIdByKmId;
    const currentCount = likeCountByKmId[item.id] ?? item.likeCount;

    setSavingKmIds(current => ({ ...current, [item.id]: true }));

    try {
      if (isLiked) {
        await unlikeKnowledgeItem(likedItemIdByKmId[item.id], item.id, currentCount);
        setLikedItemIdByKmId(current => {
          const next = { ...current };
          delete next[item.id];
          return next;
        });
        setLikeCountByKmId(current => ({ ...current, [item.id]: Math.max(0, currentCount - 1) }));
      } else {
        const historyItemId = await likeKnowledgeItem(item.id, currentUserEmail, currentCount);
        setLikedItemIdByKmId(current => ({ ...current, [item.id]: historyItemId }));
        setLikeCountByKmId(current => ({ ...current, [item.id]: currentCount + 1 }));
      }
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
