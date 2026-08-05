import * as React from 'react';
import { Hero } from '../Hero/Hero';
import { QuickLinks } from '../QuickLinks/QuickLinks';
import { NewsSection } from '../NewsSection/NewsSection';
import { KnowledgeSection } from '../KnowledgeSection/KnowledgeSection';
import { EventSection } from '../EventSection/EventSection';
import { CommunitySection } from '../CommunitySection/CommunitySection';
import { useNewsFeed } from '../../hooks/useNewsFeed';
import { useEventFeed } from '../../hooks/useEventFeed';
import { useKnowledgeFeed } from '../../hooks/useKnowledgeFeed';
import { useKnowledgeLikes } from '../../hooks/useKnowledgeLikes';
import { useCommunityFeed } from '../../hooks/useCommunityFeed';
import { useAnnouncementFeed } from '../../hooks/useAnnouncementFeed';
import { useFavoriteAppsFeed } from '../../hooks/useFavoriteAppsFeed';
import { useBannerFeed } from '../../hooks/useBannerFeed';
import { heroBackgroundUrl, quickLinks } from '../data/mockContent';
import styles from './HomePage.module.scss';

export interface HomePageProps {
  userDisplayName: string;
}

export function HomePage({ userDisplayName }: HomePageProps): React.ReactElement {
  const newsFeed = useNewsFeed();
  const eventFeed = useEventFeed();
  const knowledgeFeed = useKnowledgeFeed();
  const knowledgeLikes = useKnowledgeLikes(knowledgeFeed.items);
  const communityFeed = useCommunityFeed();
  const announcementFeed = useAnnouncementFeed();
  const favoriteAppsFeed = useFavoriteAppsFeed();
  const bannerFeed = useBannerFeed();

  return (
    <div className={styles.container}>
      <Hero
        userDisplayName={userDisplayName}
        backgroundUrl={bannerFeed.banner?.imageUrl || heroBackgroundUrl}
        favoriteApps={favoriteAppsFeed.items}
        announcements={announcementFeed.items}
        onOpenApp={favoriteAppsFeed.recordUsage}
      />
      <QuickLinks items={quickLinks} />
      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {newsFeed.feature && (
            <NewsSection feature={newsFeed.feature} items={newsFeed.items} totalCount={newsFeed.totalCount} />
          )}
          {knowledgeFeed.items.length > 0 && (
            <KnowledgeSection
              categories={knowledgeFeed.categories}
              items={knowledgeFeed.items}
              featuredItems={knowledgeFeed.featuredItems}
              totalCount={knowledgeFeed.totalCount}
              getLikeState={knowledgeLikes.getLikeState}
              onToggleLike={knowledgeLikes.toggleLike}
            />
          )}
        </div>
        <div className={styles.sidebarColumn}>
          {eventFeed.feature && (
            <EventSection feature={eventFeed.feature} items={eventFeed.items} totalCount={eventFeed.totalCount} />
          )}
          <CommunitySection posts={communityFeed.posts} onPostCreated={communityFeed.refetch} />
        </div>
      </div>
    </div>
  );
}
