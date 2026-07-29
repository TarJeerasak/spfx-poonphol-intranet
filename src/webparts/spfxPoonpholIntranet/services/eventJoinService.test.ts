import {
  applyJoinToAttendees,
  applyLeaveFromAttendees,
  buildJoinedEventMap,
  groupAttendeesByEventId
} from './eventJoinService';

describe('buildJoinedEventMap', () => {
  it('maps each Event_ID to its History_Join_Event item id', () => {
    expect(
      buildJoinedEventMap([
        { Id: 201, Event_ID: 12 },
        { Id: 202, Event_ID: 13 }
      ])
    ).toEqual({
      '12': 201,
      '13': 202
    });
  });

  it('returns an empty map for no joined events', () => {
    expect(buildJoinedEventMap([])).toEqual({});
  });
});

describe('groupAttendeesByEventId', () => {
  it('keeps only the 3 most recently joined attendees per event and derives overflow from JoinCount', () => {
    const items = [
      { Id: 1, Event_ID: 13, Created: '2026-07-01T00:00:00', UserEmail: { EMail: 'a@fusionsoft.co.th' } },
      { Id: 2, Event_ID: 13, Created: '2026-07-04T00:00:00', UserEmail: { EMail: 'b@fusionsoft.co.th' } },
      { Id: 3, Event_ID: 13, Created: '2026-07-02T00:00:00', UserEmail: { EMail: 'c@fusionsoft.co.th' } },
      { Id: 4, Event_ID: 13, Created: '2026-07-03T00:00:00', UserEmail: { EMail: 'd@fusionsoft.co.th' } }
    ];

    const result = groupAttendeesByEventId(items, { '13': 7 });

    expect(result['13'].attendeeAvatarUrls).toHaveLength(3);
    expect(result['13'].attendeeAvatarUrls[0]).toContain('b%40fusionsoft.co.th');
    expect(result['13'].overflowCount).toBe(4);
  });

  it('reports zero overflow when JoinCount is at or below the visible avatar count', () => {
    const items = [{ Id: 1, Event_ID: 20, Created: '2026-07-01T00:00:00', UserEmail: { EMail: 'a@fusionsoft.co.th' } }];

    const result = groupAttendeesByEventId(items, { '20': 1 });

    expect(result['20'].overflowCount).toBe(0);
  });

  it('includes events with a JoinCount but no fetched history rows', () => {
    const result = groupAttendeesByEventId([], { '30': 5 });

    expect(result['30']).toEqual({ attendeeAvatarUrls: [], overflowCount: 5 });
  });
});

describe('applyJoinToAttendees', () => {
  it('adds the new joiner to the front of the visible avatars when there is room', () => {
    const result = applyJoinToAttendees({ attendeeAvatarUrls: ['a', 'b'], overflowCount: 0 }, 'new');

    expect(result).toEqual({ attendeeAvatarUrls: ['new', 'a', 'b'], overflowCount: 0 });
  });

  it('bumps the last visible avatar into overflow once the list is full', () => {
    const result = applyJoinToAttendees({ attendeeAvatarUrls: ['a', 'b', 'c'], overflowCount: 4 }, 'new');

    expect(result).toEqual({ attendeeAvatarUrls: ['new', 'a', 'b'], overflowCount: 5 });
  });
});

describe('applyLeaveFromAttendees', () => {
  it('removes the leaving avatar when it is currently visible', () => {
    const result = applyLeaveFromAttendees({ attendeeAvatarUrls: ['a', 'b', 'c'], overflowCount: 2 }, 'b');

    expect(result).toEqual({ attendeeAvatarUrls: ['a', 'c'], overflowCount: 2 });
  });

  it('decrements overflow when the leaving avatar was not in the visible slice', () => {
    const result = applyLeaveFromAttendees({ attendeeAvatarUrls: ['a', 'b', 'c'], overflowCount: 2 }, 'z');

    expect(result).toEqual({ attendeeAvatarUrls: ['a', 'b', 'c'], overflowCount: 1 });
  });

  it('never lets overflow go negative', () => {
    const result = applyLeaveFromAttendees({ attendeeAvatarUrls: ['a'], overflowCount: 0 }, 'z');

    expect(result.overflowCount).toBe(0);
  });
});
