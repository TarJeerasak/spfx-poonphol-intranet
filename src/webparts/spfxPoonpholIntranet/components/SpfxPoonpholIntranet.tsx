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
import { useNewsFeed } from '../hooks/useNewsFeed';
import { useEventFeed } from '../hooks/useEventFeed';
import { useKnowledgeFeed } from '../hooks/useKnowledgeFeed';
import { useCommunityFeed } from '../hooks/useCommunityFeed';
import { announcements, heroBackgroundUrl, navLinks, quickAppSearches, quickLinks } from './data/mockContent';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;600&display=swap';

export default function SpfxPoonpholIntranet({ hasTeamsContext, userDisplayName }: ISpfxPoonpholIntranetProps): React.ReactElement {
  useExternalStylesheet(GOOGLE_FONTS_URL);
  const newsFeed = useNewsFeed();
  const eventFeed = useEventFeed();
  const knowledgeFeed = useKnowledgeFeed();
  const communityFeed = useCommunityFeed();

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
            {newsFeed.feature && (
              <NewsSection feature={newsFeed.feature} items={newsFeed.items} totalCount={newsFeed.totalCount} />
            )}
            {knowledgeFeed.items.length > 0 && (
              <KnowledgeSection categories={knowledgeFeed.categories} items={knowledgeFeed.items} totalCount={knowledgeFeed.totalCount} />
            )}
          </div>
          <div className={styles.sidebarColumn}>
            {eventFeed.feature && (
              <EventSection feature={eventFeed.feature} items={eventFeed.items} totalCount={eventFeed.totalCount} />
            )}
            {communityFeed.posts.length > 0 && <CommunitySection posts={communityFeed.posts} />}
          </div>
        </div>
      </div>
      <Footer navLinks={navLinks} />
    </div>
  );
}
