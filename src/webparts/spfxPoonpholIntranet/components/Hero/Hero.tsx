import * as React from 'react';
import { Announcement } from '../../../../shared/types/content';
import { Announcements } from '../Announcements/Announcements';
import searchIcon from '../../assets/home/icons/search.svg';
import styles from './Hero.module.scss';

export interface HeroProps {
  userDisplayName: string;
  backgroundUrl: string;
  quickAppSearches: string[];
  announcements: Announcement[];
}

export function Hero({ userDisplayName, backgroundUrl, quickAppSearches, announcements }: HeroProps): React.ReactElement {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeText}>
            <p className={styles.greeting}>ยินดีต้อนรับ</p>
            <p className={styles.userName}>คุณ{userDisplayName}</p>
            <p className={styles.tagline}>
              ร่วมสร้างการเติบโตอย่างยั่งยืน
              <br />
              ไปด้วยกันกับ Poonphol Group
            </p>
          </div>
          <div className={styles.searchBox}>
            <img src={searchIcon} alt="" width={18} height={18} />
            <span>search</span>
          </div>
          <div className={styles.quickApps}>
            {quickAppSearches.map(app => (
              <button key={app} type="button" className={styles.quickAppButton}>
                {app}
              </button>
            ))}
          </div>
        </div>
        <Announcements items={announcements} />
      </div>
    </section>
  );
}
