import { useEffect, useState } from 'react';
import { EventItem } from '../../../shared/types/content';
import { getCurrentUser, ICurrentUser } from '../../../shared/services/currentUser';
import { buildUserPhotoUrl } from '../../../shared/utils/buildUserPhotoUrl';
import {
  applyJoinToAttendees,
  applyLeaveFromAttendees,
  cancelEventJoin,
  EventAttendeesSummary,
  fetchJoinedEventMap,
  joinEvent
} from '../services/eventJoinService';

export interface EventJoinState {
  isJoined: boolean;
  attendeeAvatarUrls: string[];
  overflowCount: number;
  isSaving: boolean;
}

export interface UseEventJoinsResult {
  getJoinState: (event: EventItem) => EventJoinState;
  toggleJoin: (event: EventItem) => void;
}

export function useEventJoins(events: EventItem[]): UseEventJoinsResult {
  const [currentUser, setCurrentUser] = useState<ICurrentUser | undefined>(undefined);
  const [joinedItemIdByEventId, setJoinedItemIdByEventId] = useState<Record<string, number>>({});
  const [attendeesByEventId, setAttendeesByEventId] = useState<Record<string, EventAttendeesSummary>>({});
  const [savingEventIds, setSavingEventIds] = useState<Record<string, boolean>>({});

  const eventIdsKey = events.map(event => event.id).join(',');

  useEffect(() => {
    setAttendeesByEventId(current => {
      const next = { ...current };
      events.forEach(event => {
        if (!(event.id in next)) {
          next[event.id] = { attendeeAvatarUrls: event.attendeeAvatarUrls, overflowCount: event.overflowCount };
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventIdsKey]);

  useEffect(() => {
    if (!eventIdsKey) {
      return undefined;
    }

    let isCancelled = false;

    getCurrentUser()
      .then(user => {
        if (isCancelled) {
          return undefined;
        }
        setCurrentUser(user);
        return fetchJoinedEventMap(user.id);
      })
      .then(joinedEventMap => {
        if (!isCancelled && joinedEventMap) {
          setJoinedItemIdByEventId(joinedEventMap);
        }
      })
      .catch(() => {
        // Leave events unmarked as joined if we can't determine the current user's join history.
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventIdsKey]);

  function getAttendees(event: EventItem): EventAttendeesSummary {
    return attendeesByEventId[event.id] ?? { attendeeAvatarUrls: event.attendeeAvatarUrls, overflowCount: event.overflowCount };
  }

  function getJoinState(event: EventItem): EventJoinState {
    const attendees = getAttendees(event);
    return {
      isJoined: event.id in joinedItemIdByEventId,
      attendeeAvatarUrls: attendees.attendeeAvatarUrls,
      overflowCount: attendees.overflowCount,
      isSaving: !!savingEventIds[event.id]
    };
  }

  async function toggleJoin(event: EventItem): Promise<void> {
    if (!currentUser || savingEventIds[event.id]) {
      return;
    }

    const isJoined = event.id in joinedItemIdByEventId;
    const attendees = getAttendees(event);
    const currentJoinCount = attendees.attendeeAvatarUrls.length + attendees.overflowCount;
    const currentUserAvatarUrl = buildUserPhotoUrl(currentUser.email);

    setSavingEventIds(current => ({ ...current, [event.id]: true }));

    try {
      if (isJoined) {
        await cancelEventJoin(joinedItemIdByEventId[event.id], Number(event.id), currentJoinCount);
        setJoinedItemIdByEventId(current => {
          const next = { ...current };
          delete next[event.id];
          return next;
        });
        setAttendeesByEventId(current => ({ ...current, [event.id]: applyLeaveFromAttendees(attendees, currentUserAvatarUrl) }));
      } else {
        const historyItemId = await joinEvent(Number(event.id), currentUser.id, currentJoinCount);
        setJoinedItemIdByEventId(current => ({ ...current, [event.id]: historyItemId }));
        setAttendeesByEventId(current => ({ ...current, [event.id]: applyJoinToAttendees(attendees, currentUserAvatarUrl) }));
      }
    } finally {
      setSavingEventIds(current => {
        const next = { ...current };
        delete next[event.id];
        return next;
      });
    }
  }

  return { getJoinState, toggleJoin };
}
