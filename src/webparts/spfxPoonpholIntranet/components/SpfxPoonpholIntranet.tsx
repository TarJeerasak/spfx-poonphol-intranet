import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useExternalStylesheet } from '../../../shared/hooks/useExternalStylesheet';
import styles from './SpfxPoonpholIntranet.module.scss';
import type { ISpfxPoonpholIntranetProps } from './ISpfxPoonpholIntranetProps';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { HomePage } from './HomePage/HomePage';
import { DocumentCenterPage } from './DocumentCenter/DocumentCenterPage';
import { navLinks } from './data/mockContent';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;600&display=swap';

export default function SpfxPoonpholIntranet({ hasTeamsContext, userDisplayName }: ISpfxPoonpholIntranetProps): React.ReactElement {
  useExternalStylesheet(GOOGLE_FONTS_URL);

  return (
    <HashRouter>
      <div className={`${styles.page} ${hasTeamsContext ? styles.teams : ''}`}>
        <Header navLinks={navLinks} userDisplayName={userDisplayName} />
        <Routes>
          <Route path="/" element={<HomePage userDisplayName={userDisplayName} />} />
          <Route path="/documents" element={<DocumentCenterPage />} />
        </Routes>
        <Footer navLinks={navLinks} />
      </div>
    </HashRouter>
  );
}
