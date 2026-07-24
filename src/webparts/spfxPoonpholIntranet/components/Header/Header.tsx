import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { Logo } from '../../../../shared/components/Logo/Logo';
import { NavLink } from '../../../../shared/types/content';
import styles from './Header.module.scss';

export interface HeaderProps {
  navLinks: NavLink[];
  userDisplayName: string;
}

export function Header({ navLinks, userDisplayName }: HeaderProps): React.ReactElement {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo height={80} />
          <div className={styles.divider} />
          <nav className={styles.nav}>
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                className={`${styles.navLink} ${link.isActive ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className={styles.avatarBlock}>
          <span className={styles.userName}>{userDisplayName}</span>
          <Icon name="chevronDown" size={20} className={styles.chevron} />
        </div>
      </div>
    </header>
  );
}
