import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Dropdown } from '../../../../shared/components/Dropdown/Dropdown';
import { useKnowledgeFeed } from '../../hooks/useKnowledgeFeed';
import bannerImageUrl from '../../assets/knowledge/hero-banner.jpg';
import { KnowledgeGridCard } from './KnowledgeGridCard';
import styles from './KnowledgePage.module.scss';

const ALL_CATEGORY_VALUE = 'all';
const FEATURED_CARD_COUNT = 4;
const INITIAL_VISIBLE_COUNT = 8;
const VISIBLE_COUNT_STEP = 8;

export function KnowledgePage(): React.ReactElement {
  const { items, featuredItems, categories, recordRead } = useKnowledgeFeed();
  const [categoryId, setCategoryId] = React.useState(ALL_CATEGORY_VALUE);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [search, setSearch] = React.useState('');

  const categoryOptions = [
    { value: ALL_CATEGORY_VALUE, label: 'ทุกหมวดหมู่' },
    ...categories.filter(category => category.id !== ALL_CATEGORY_VALUE).map(category => ({ value: category.id, label: category.label }))
  ];

  const filteredItems = items.filter(item => {
    const matchesCategory = categoryId === ALL_CATEGORY_VALUE || item.categoryId === categoryId;
    const matchesSearch = search.trim().length === 0 || item.title.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setSearch(searchDraft);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <div className={styles.page}>
      <section className={styles.banner} style={{ backgroundImage: `url(${bannerImageUrl})` }}>
        <div className={styles.bannerFade} />
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Knowledge Management</h1>
          <p className={styles.bannerSubtitle}>ค้นหาความรู้ คู่มือการทำงาน และเอกสารอบรม ของกลุ่มพูลผล</p>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <span className={styles.searchBox}>
              <span className={styles.searchIcon}>
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="search"
                value={searchDraft}
                onChange={event => setSearchDraft(event.target.value)}
                aria-label="ค้นหาความรู้"
              />
            </span>
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
      </section>

      <div className={styles.container}>
        {featuredItems.length > 0 && (
          <section className={styles.panel}>
            <p className={styles.panelTitle}>บทเรียนแนะนำ</p>
            <div className={styles.panelDivider} />
            <div className={styles.cardGrid}>
              {featuredItems.slice(0, FEATURED_CARD_COUNT).map(item => (
                <KnowledgeGridCard key={item.id} item={item} onRead={() => recordRead(item.id)} />
              ))}
            </div>
          </section>
        )}

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>คลังความรู้</p>
            <Dropdown
              label="กรองตามหมวดหมู่"
              value={categoryId}
              options={categoryOptions}
              onChange={value => {
                setCategoryId(value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
            />
          </div>
          <div className={styles.panelDivider} />
          {visibleItems.length > 0 ? (
            <div className={styles.cardGrid}>
              {visibleItems.map(item => (
                <KnowledgeGridCard key={item.id} item={item} onRead={() => recordRead(item.id)} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyMessage}>ไม่พบความรู้ที่ตรงกับเงื่อนไขที่เลือก</p>
          )}
          {hasMore && (
            <div className={styles.viewMoreRow}>
              <button
                type="button"
                className={styles.viewMoreButton}
                onClick={() => setVisibleCount(current => current + VISIBLE_COUNT_STEP)}
              >
                ดูทั้งหมด
                <Icon name="chevronDown" size={16} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
