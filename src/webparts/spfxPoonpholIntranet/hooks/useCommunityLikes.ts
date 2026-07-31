import { useEffect, useState } from 'react';
import { CommunityPost } from '../../../shared/types/content';
import { getCurrentUser } from '../../../shared/services/currentUser';
import { fetchLikedPostMap, likePost, unlikePost } from '../services/communityLikeService';

export interface CommunityLikeState {
  isLiked: boolean;
  likeCount: number;
  isSaving: boolean;
}

export interface UseCommunityLikesResult {
  currentUserEmail: string | undefined;
  getLikeState: (post: CommunityPost) => CommunityLikeState;
  toggleLike: (post: CommunityPost) => void;
}

export function useCommunityLikes(posts: CommunityPost[]): UseCommunityLikesResult {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [likedItemIdByPostId, setLikedItemIdByPostId] = useState<Record<string, number>>({});
  const [likeCountByPostId, setLikeCountByPostId] = useState<Record<string, number>>({});
  const [savingPostIds, setSavingPostIds] = useState<Record<string, boolean>>({});

  const postIdsKey = posts.map(post => post.id).join(',');

  useEffect(() => {
    setLikeCountByPostId(current => {
      const next = { ...current };
      posts.forEach(post => {
        if (!(post.id in next)) {
          next[post.id] = post.likeCount;
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postIdsKey]);

  useEffect(() => {
    if (!postIdsKey) {
      return undefined;
    }

    let isCancelled = false;

    getCurrentUser()
      .then(user => {
        if (isCancelled) {
          return undefined;
        }
        setCurrentUserEmail(user.email);
        return fetchLikedPostMap(user.email);
      })
      .then(likedPostMap => {
        if (!isCancelled && likedPostMap) {
          setLikedItemIdByPostId(likedPostMap);
        }
      })
      .catch(() => {
        // Leave posts unmarked as liked if we can't determine the current user's like history.
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postIdsKey]);

  function getLikeState(post: CommunityPost): CommunityLikeState {
    return {
      isLiked: post.id in likedItemIdByPostId,
      likeCount: likeCountByPostId[post.id] ?? post.likeCount,
      isSaving: !!savingPostIds[post.id]
    };
  }

  async function toggleLike(post: CommunityPost): Promise<void> {
    if (!currentUserEmail || savingPostIds[post.id]) {
      return;
    }

    const isLiked = post.id in likedItemIdByPostId;
    const currentCount = likeCountByPostId[post.id] ?? post.likeCount;

    setSavingPostIds(current => ({ ...current, [post.id]: true }));

    try {
      if (isLiked) {
        await unlikePost(likedItemIdByPostId[post.id], Number(post.id), currentCount);
        setLikedItemIdByPostId(current => {
          const next = { ...current };
          delete next[post.id];
          return next;
        });
        setLikeCountByPostId(current => ({ ...current, [post.id]: Math.max(0, currentCount - 1) }));
      } else {
        const historyItemId = await likePost(Number(post.id), currentUserEmail, currentCount);
        setLikedItemIdByPostId(current => ({ ...current, [post.id]: historyItemId }));
        setLikeCountByPostId(current => ({ ...current, [post.id]: currentCount + 1 }));
      }
    } finally {
      setSavingPostIds(current => {
        const next = { ...current };
        delete next[post.id];
        return next;
      });
    }
  }

  return { currentUserEmail, getLikeState, toggleLike };
}
