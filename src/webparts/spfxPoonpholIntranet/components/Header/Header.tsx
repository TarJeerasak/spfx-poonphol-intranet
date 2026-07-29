import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../../../../shared/components/Logo/Logo';
import { NavLink } from '../../../../shared/types/content';
import styles from './Header.module.scss';

export interface HeaderProps {
  navLinks: NavLink[];
  userDisplayName: string;
}

export function Header({ navLinks, userDisplayName }: HeaderProps): React.ReactElement {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Logo height={80} />
          <div className={styles.divider} />
          <nav className={styles.nav}>
            {navLinks.map(link => {
              const isActive = link.to !== undefined && link.to === pathname;
              const className = `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;
              return link.to ? (
                <Link key={link.id} to={link.to} className={className}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.href} className={className}>
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div className={styles.avatarBlock}>
          <span className={styles.userName}>{userDisplayName}</span>
        </div>
      </div>
    </header>
  );
}
