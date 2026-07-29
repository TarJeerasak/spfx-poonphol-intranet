import * as React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../../../shared/components/Logo/Logo';
import { NavLink } from '../../../../shared/types/content';
import styles from './Footer.module.scss';

export interface FooterProps {
  navLinks: NavLink[];
}

export function Footer({ navLinks }: FooterProps): React.ReactElement {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Logo height={80} />
          <nav className={styles.nav}>
            {navLinks.map(link =>
              link.to ? (
                <Link key={link.id} to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>
        <div className={styles.divider} />
        <div className={styles.bottom}>
          <p className={styles.copyright}>© Copyright 2024 POONPHOL GROUP ― All Rights Reserved.</p>
          <a href="#" className={styles.privacyLink}>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
