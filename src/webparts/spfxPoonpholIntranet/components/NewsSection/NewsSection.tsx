import * as React from 'react';
import { SectionHeader } from '../../../../shared/components/SectionHeader/SectionHeader';
import { SectionFooter } from '../../../../shared/components/SectionFooter/SectionFooter';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { NewsItem } from '../../../../shared/types/content';
import { NewsFeatureCard } from './NewsFeatureCard';
import { NewsListItem } from './NewsListItem';
import newsIcon from '../../assets/home/icons/sections/news.svg';
import styles from './NewsSection.module.scss';

export interface NewsSectionProps {
  feature: NewsItem;
  items: NewsItem[];
  totalCount: number;
}

export function NewsSection({ feature, items, totalCount }: NewsSectionProps): React.ReactElement {
  const [ref, isVisible] = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} ${isVisible ? styles.isVisible : ''}`}>
      <SectionHeader iconUrl={newsIcon} tintColor="#2d464d" title="NEWS" subtitle="ข่าวสารองค์กร" />
      <NewsFeatureCard item={feature} />
      <div className={styles.list}>
        {items.map(item => (
          <NewsListItem key={item.id} item={item} />
        ))}
      </div>
      <div className={styles.divider} />
      <SectionFooter shownCount={items.length} totalCount={totalCount} />
    </section>
  );
}
