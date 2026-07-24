import * as React from 'react';
import { IconTile } from '../IconTile/IconTile';
import { IconName } from '../Icon/Icon';
import styles from './SectionHeader.module.scss';

export interface SectionHeaderProps {
  iconName?: IconName;
  iconUrl?: string;
  tintColor?: string;
  title: string;
  subtitle: string;
  rightSlot?: React.ReactNode;
}

export function SectionHeader({ iconName, iconUrl, tintColor, title, subtitle, rightSlot }: SectionHeaderProps): React.ReactElement {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <IconTile
          shape="square"
          width={60}
          height={56}
          iconSize={24}
          iconName={iconName}
          iconUrl={iconUrl}
          backgroundColor={tintColor}
        />
        <div className={styles.titles}>
          <p className={styles.title} style={tintColor ? { color: tintColor } : undefined}>
            {title}
          </p>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
      {rightSlot ? <div className={styles.right}>{rightSlot}</div> : null}
    </div>
  );
}
