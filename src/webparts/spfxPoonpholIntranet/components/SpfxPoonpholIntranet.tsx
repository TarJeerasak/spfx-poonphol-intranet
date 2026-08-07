import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useExternalStylesheet } from '../../../shared/hooks/useExternalStylesheet';
import styles from './SpfxPoonpholIntranet.module.scss';
import type { ISpfxPoonpholIntranetProps } from './ISpfxPoonpholIntranetProps';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { HomePage } from './HomePage/HomePage';
import { DocumentCenterPage } from './DocumentCenter/DocumentCenterPage';
import { MoreAppsPage } from './MoreApps/MoreAppsPage';
import { TelephoneListPage } from './TelephoneList/TelephoneListPage';
import { KnowledgePage } from './Knowledge/KnowledgePage';
import { KnowledgeDetailPage } from './Knowledge/KnowledgeDetailPage';
import { EventsPage } from './Events/EventsPage';
import { EventDetailPage } from './Events/EventDetailPage';
import { GalleryPage } from './Gallery/GalleryPage';
import { NewsPage } from './News/NewsPage';
import { NewsDetailPage } from './News/NewsDetailPage';
import { AnnouncementsPage } from './Announcements/AnnouncementsPage';
import { AnnouncementDetailPage } from './Announcements/AnnouncementDetailPage';
import { navLinks } from './data/mockContent';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;600&display=swap';

export default function SpfxPoonpholIntranet({ hasTeamsContext, userDisplayName }: ISpfxPoonpholIntranetProps): React.ReactElement {
  useExternalStylesheet(GOOGLE_FONTS_URL);

  return (
    <HashRouter>
      <div className={`${styles.page} ${hasTeamsContext ? styles.teams : ''}`}>
        <Header navLinks={navLinks} userDisplayName={userDisplayName} />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<HomePage userDisplayName={userDisplayName} />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/documents" element={<DocumentCenterPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/telephone-list" element={<TelephoneListPage />} />
            <Route path="/more-apps" element={<MoreAppsPage />} />
          </Routes>
        </main>
        <Footer navLinks={navLinks} />
      </div>
    </HashRouter>
  );
}
