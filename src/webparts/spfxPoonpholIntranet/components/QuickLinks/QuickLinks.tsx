import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconTile } from '../../../../shared/components/IconTile/IconTile';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { QuickLink } from '../../../../shared/types/content';
import styles from './QuickLinks.module.scss';

export interface QuickLinksProps {
  items: QuickLink[];
}

export function QuickLinks({ items }: QuickLinksProps): React.ReactElement {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`${styles.row} ${isVisible ? styles.isVisible : ''}`}>
      {items.map((item, index) => {
        const tile = (
          <>
            <IconTile
              shape="circle"
              size={113}
              iconSize={64}
              iconUrl={item.iconUrl}
              backgroundColor={item.backgroundColor}
            />
            <span className={styles.label}>{item.label}</span>
          </>
        );
        const style = { transitionDelay: isVisible ? `${index * 60}ms` : '0ms' };

        return item.to ? (
          <Link key={item.id} to={item.to} className={styles.item} style={style}>
            {tile}
          </Link>
        ) : (
          <a key={item.id} href="#" className={styles.item} style={style}>
            {tile}
          </a>
        );
      })}
    </div>
  );
}
