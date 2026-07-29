import { fetchRequestDigest, spApi } from '../../../shared/services/api';
import { buildUserPhotoUrl } from '../../../shared/utils/buildUserPhotoUrl';

const HISTORY_LIST_TITLE = 'History_Join_Event';
const CALENDAR_LIST_TITLE = 'CalendarList';
export const MAX_ATTENDEE_AVATAR_COUNT = 3;

export type JoinedEventMap = Record<string, number>;

export interface EventAttendeesSummary {
  attendeeAvatarUrls: string[];
  overflowCount: number;
}

export type EventAttendeesByEventId = Record<string, EventAttendeesSummary>;

interface ISPJoinHistoryListItem {
  Id: number;
  Event_ID: number;
}

interface ISPJoinHistoryItemWithAttendee {
  Id: number;
  Event_ID: number;
  Created: string;
  UserEmail?: { EMail?: string };
}

export function buildJoinedEventMap(items: ISPJoinHistoryListItem[]): JoinedEventMap {
  const map: JoinedEventMap = {};
  items.forEach(item => {
    map[String(item.Event_ID)] = item.Id;
  });
  return map;
}

// UserEmail is a Person or Group field, so filtering/creating against it uses the
// resolved SharePoint user id (UserEmailId), not the raw email string.
export async function fetchJoinedEventMap(userId: number): Promise<JoinedEventMap> {
  const response = await spApi.get<{ value: ISPJoinHistoryListItem[] }>(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,Event_ID',
      $filter: `UserEmailId eq ${userId}`,
      $top: 5000
    }
  });

  return buildJoinedEventMap(response.data.value);
}

export function groupAttendeesByEventId(
  items: ISPJoinHistoryItemWithAttendee[],
  joinCountByEventId: Record<string, number>
): EventAttendeesByEventId {
  const sortedByMostRecent = [...items].sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
  const result: EventAttendeesByEventId = {};

  sortedByMostRecent.forEach(item => {
    const eventId = String(item.Event_ID);
    if (!result[eventId]) {
      result[eventId] = { attendeeAvatarUrls: [], overflowCount: 0 };
    }
    if (result[eventId].attendeeAvatarUrls.length < MAX_ATTENDEE_AVATAR_COUNT) {
      result[eventId].attendeeAvatarUrls.push(buildUserPhotoUrl(item.UserEmail?.EMail));
    }
  });

  Object.keys(joinCountByEventId).forEach(eventId => {
    if (!result[eventId]) {
      result[eventId] = { attendeeAvatarUrls: [], overflowCount: 0 };
    }
    result[eventId].overflowCount = Math.max(0, joinCountByEventId[eventId] - result[eventId].attendeeAvatarUrls.length);
  });

  return result;
}

export async function fetchEventAttendees(
  eventIds: string[],
  joinCountByEventId: Record<string, number>
): Promise<EventAttendeesByEventId> {
  if (eventIds.length === 0) {
    return {};
  }

  const response = await spApi.get<{ value: ISPJoinHistoryItemWithAttendee[] }>(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`, {
    params: {
      $select: 'Id,Event_ID,Created,UserEmail/EMail',
      $expand: 'UserEmail',
      $filter: eventIds.map(eventId => `Event_ID eq ${eventId}`).join(' or '),
      $orderby: 'Created desc',
      $top: 5000
    }
  });

  return groupAttendeesByEventId(response.data.value, joinCountByEventId);
}

export function applyJoinToAttendees(current: EventAttendeesSummary, joinerAvatarUrl: string): EventAttendeesSummary {
  const nextAvatars = [joinerAvatarUrl, ...current.attendeeAvatarUrls];

  if (nextAvatars.length <= MAX_ATTENDEE_AVATAR_COUNT) {
    return { attendeeAvatarUrls: nextAvatars, overflowCount: current.overflowCount };
  }

  return {
    attendeeAvatarUrls: nextAvatars.slice(0, MAX_ATTENDEE_AVATAR_COUNT),
    overflowCount: current.overflowCount + 1
  };
}

// If the leaving user's avatar isn't in the visible slice (it was pushed into the overflow
// count instead), we can only shrink the count - the next full refetch reconciles the avatars.
export function applyLeaveFromAttendees(current: EventAttendeesSummary, leaverAvatarUrl: string): EventAttendeesSummary {
  if (current.attendeeAvatarUrls.indexOf(leaverAvatarUrl) === -1) {
    return { attendeeAvatarUrls: current.attendeeAvatarUrls, overflowCount: Math.max(0, current.overflowCount - 1) };
  }

  return {
    attendeeAvatarUrls: current.attendeeAvatarUrls.filter(url => url !== leaverAvatarUrl),
    overflowCount: current.overflowCount
  };
}

export async function joinEvent(eventId: number, userId: number, currentJoinCount: number): Promise<number> {
  const digest = await fetchRequestDigest();

  const createResponse = await spApi.post<{ Id: number }>(
    `/lists/getbytitle('${HISTORY_LIST_TITLE}')/items`,
    { UserEmailId: userId, Event_ID: eventId },
    { headers: { 'X-RequestDigest': digest } }
  );

  await spApi.post(
    `/lists/getbytitle('${CALENDAR_LIST_TITLE}')/items(${eventId})`,
    { JoinCount: currentJoinCount + 1 },
    { headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*' } }
  );

  return createResponse.data.Id;
}

export async function cancelEventJoin(historyItemId: number, eventId: number, currentJoinCount: number): Promise<void> {
  const digest = await fetchRequestDigest();

  await spApi.post(`/lists/getbytitle('${HISTORY_LIST_TITLE}')/items(${historyItemId})`, undefined, {
    headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'DELETE', 'IF-MATCH': '*' }
  });

  await spApi.post(
    `/lists/getbytitle('${CALENDAR_LIST_TITLE}')/items(${eventId})`,
    { JoinCount: Math.max(0, currentJoinCount - 1) },
    { headers: { 'X-RequestDigest': digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*' } }
  );
}
