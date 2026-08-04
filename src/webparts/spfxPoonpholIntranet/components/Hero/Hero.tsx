import * as React from 'react';
import { Announcement, FavoriteAppLink } from '../../../../shared/types/content';
import { getFirstName } from '../../../../shared/utils/getFirstName';
import { Announcements } from '../Announcements/Announcements';
import searchIcon from '../../assets/home/icons/search.svg';
import styles from './Hero.module.scss';

export interface HeroProps {
  userDisplayName: string;
  backgroundUrl: string;
  favoriteApps: FavoriteAppLink[];
  announcements: Announcement[];
  onOpenApp: (app: FavoriteAppLink) => void;
}

export function Hero({ userDisplayName, backgroundUrl, favoriteApps, announcements, onOpenApp }: HeroProps): React.ReactElement {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeText}>
            <p className={styles.greeting}>ยินดีต้อนรับ</p>
            <p className={styles.userName}>{getFirstName(userDisplayName)}</p>
            <p className={styles.tagline}>
              ร่วมสร้างการเติบโตอย่างยั่งยืน
              <br />
              ไปด้วยกันกับกลุ่มพูลผล
            </p>
          </div>
          <div className={styles.searchBox}>
            <img src={searchIcon} alt="" width={18} height={18} />
            <span>search</span>
          </div>
          <div className={styles.quickApps}>
            {favoriteApps.map(app => (
              <a
                key={app.id}
                href={app.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.quickAppButton}
                onClick={() => onOpenApp(app)}
              >
                {app.name}
              </a>
            ))}
          </div>
        </div>
        <Announcements items={announcements} />
      </div>
    </section>
  );
}
