import * as React from 'react';
import { SectionHeader } from '../../../../shared/components/SectionHeader/SectionHeader';
import { SectionFooter } from '../../../../shared/components/SectionFooter/SectionFooter';
import { KnowledgeCategory, KnowledgeItem } from '../../../../shared/types/content';
import { KnowledgeCard } from './KnowledgeCard';
import kmIcon from '../../assets/home/icons/sections/km.svg';
import styles from './KnowledgeSection.module.scss';

export interface KnowledgeSectionProps {
  categories: KnowledgeCategory[];
  items: KnowledgeItem[];
  totalCount: number;
}

export function KnowledgeSection({ categories, items, totalCount }: KnowledgeSectionProps): React.ReactElement {
  const [activeCategoryId, setActiveCategoryId] = React.useState(categories[0]?.id ?? 'all');

  const visibleItems = activeCategoryId === 'all' ? items : items.filter(item => item.categoryId === activeCategoryId);

  return (
    <section className={styles.section}>
      <SectionHeader iconUrl={kmIcon} tintColor="#71b4a0" title="Knowledge Management" subtitle="คลังความรู้" />
      <div className={styles.divider} />
      <div className={styles.tabs}>
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            className={`${styles.tab} ${category.id === activeCategoryId ? styles.tabActive : ''}`}
            onClick={() => setActiveCategoryId(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className={styles.cards}>
        {visibleItems.map(item => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>
      <SectionFooter shownCount={visibleItems.length} totalCount={totalCount} />
    </section>
  );
}
