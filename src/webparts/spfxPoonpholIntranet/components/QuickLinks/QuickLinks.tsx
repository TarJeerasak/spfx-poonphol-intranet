import * as React from 'react';
import { IconTile } from '../../../../shared/components/IconTile/IconTile';
import { QuickLink } from '../../../../shared/types/content';
import styles from './QuickLinks.module.scss';

export interface QuickLinksProps {
  items: QuickLink[];
}

export function QuickLinks({ items }: QuickLinksProps): React.ReactElement {
  return (
    <div className={styles.row}>
      {items.map(item => (
        <a key={item.id} href="#" className={styles.item}>
          <IconTile
            shape="circle"
            size={113}
            iconSize={64}
            iconUrl={item.iconUrl}
            backgroundColor={item.backgroundColor}
          />
          <span className={styles.label}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
