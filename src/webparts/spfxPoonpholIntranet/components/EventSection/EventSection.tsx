import * as React from 'react';
import { SectionHeader } from '../../../../shared/components/SectionHeader/SectionHeader';
import { SectionFooter } from '../../../../shared/components/SectionFooter/SectionFooter';
import { EventItem } from '../../../../shared/types/content';
import { EventFeatureCard } from './EventFeatureCard';
import { EventListItem } from './EventListItem';
import eventIcon from '../../assets/home/icons/sections/event.svg';
import styles from './EventSection.module.scss';

export interface EventSectionProps {
  feature: EventItem;
  items: EventItem[];
  totalCount: number;
}

export function EventSection({ feature, items, totalCount }: EventSectionProps): React.ReactElement {
  return (
    <section className={styles.section}>
      <SectionHeader iconUrl={eventIcon} tintColor="#316f64" title="Event" subtitle="กิจกรรมองค์กร" />
      <EventFeatureCard item={feature} />
      <div className={styles.list}>
        {items.map(item => (
          <EventListItem key={item.id} item={item} />
        ))}
      </div>
      <div className={styles.divider} />
      <SectionFooter shownCount={items.length} totalCount={totalCount} />
    </section>
  );
}
