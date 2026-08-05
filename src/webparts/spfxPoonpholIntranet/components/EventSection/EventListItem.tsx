import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/Button/Button';
import { EventItem } from '../../../../shared/types/content';
import { EventJoinState } from '../../hooks/useEventJoins';
import styles from './EventListItem.module.scss';

export interface EventListItemProps {
  item: EventItem;
  joinState: EventJoinState;
  onToggleJoin: () => void;
}

export function EventListItem({ item, joinState, onToggleJoin }: EventListItemProps): React.ReactElement {
  const handleJoinClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    onToggleJoin();
  };

  return (
    <Link to={`/events/${item.id}`} className={styles.row}>
      <div className={styles.dateBadge}>
        <span className={styles.day}>{item.dateDay}</span>
        <span className={styles.month}>{item.dateMonthLabel}</span>
      </div>
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailImage} style={{ backgroundImage: `url(${item.imageUrl})` }} />
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{item.title}</p>
        <div className={styles.meta}>
          {item.timeLabel && <span>{item.timeLabel}</span>}
          {item.timeLabel && item.locationLabel && <span className={styles.metaDivider} />}
          {item.locationLabel && <span>{item.locationLabel}</span>}
        </div>
        <div className={styles.footer}>
          <div className={styles.avatarGroup}>
            {joinState.attendeeAvatarUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt=""
                className={styles.avatar}
                style={{ zIndex: joinState.attendeeAvatarUrls.length - index }}
              />
            ))}
            {joinState.overflowCount > 0 ? <span className={styles.overflow}>+{joinState.overflowCount}</span> : null}
          </div>
          <Button variant="outline" onClick={handleJoinClick} disabled={joinState.isSaving} aria-pressed={joinState.isJoined}>
            {joinState.isJoined ? 'ยกเลิก' : 'เข้าร่วม'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
