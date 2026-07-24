import * as React from 'react';
import { useExternalStylesheet } from '../../../shared/hooks/useExternalStylesheet';
import styles from './SpfxPoonpholIntranet.module.scss';
import type { ISpfxPoonpholIntranetProps } from './ISpfxPoonpholIntranetProps';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { Hero } from './Hero/Hero';
import { QuickLinks } from './QuickLinks/QuickLinks';
import { NewsSection } from './NewsSection/NewsSection';
import { KnowledgeSection } from './KnowledgeSection/KnowledgeSection';
import { EventSection } from './EventSection/EventSection';
import { CommunitySection } from './CommunitySection/CommunitySection';
import {
  announcements,
  communityPosts,
  eventFeature,
  eventList,
  heroBackgroundUrl,
  knowledgeCategories,
  knowledgeItems,
  navLinks,
  newsFeature,
  newsList,
  quickAppSearches,
  quickLinks
} from './data/mockContent';

const TOTAL_NEWS_COUNT = 24;
const TOTAL_KNOWLEDGE_COUNT = 24;
const TOTAL_EVENT_COUNT = 24;
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;600&display=swap';

export default function SpfxPoonpholIntranet({ hasTeamsContext, userDisplayName }: ISpfxPoonpholIntranetProps): React.ReactElement {
  useExternalStylesheet(GOOGLE_FONTS_URL);

  return (
    <div className={`${styles.page} ${hasTeamsContext ? styles.teams : ''}`}>
      <Header navLinks={navLinks} userDisplayName={userDisplayName} />
      <div className={styles.container}>
        <Hero
          userDisplayName={userDisplayName}
          backgroundUrl={heroBackgroundUrl}
          quickAppSearches={quickAppSearches}
          announcements={announcements}
        />
        <QuickLinks items={quickLinks} />
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <NewsSection feature={newsFeature} items={newsList} totalCount={TOTAL_NEWS_COUNT} />
            <KnowledgeSection categories={knowledgeCategories} items={knowledgeItems} totalCount={TOTAL_KNOWLEDGE_COUNT} />
          </div>
          <div className={styles.sidebarColumn}>
            <EventSection feature={eventFeature} items={eventList} totalCount={TOTAL_EVENT_COUNT} />
            <CommunitySection posts={communityPosts} />
          </div>
        </div>
      </div>
      <Footer navLinks={navLinks} />
    </div>
  );
}
