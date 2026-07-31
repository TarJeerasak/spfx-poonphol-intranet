import * as React from 'react';
import { Icon, IconName } from '../Icon/Icon';
import styles from './IconTile.module.scss';

export interface IconTileProps {
  iconName?: IconName;
  iconUrl?: string;
  shape?: 'circle' | 'square';
  size?: number;
  width?: number;
  height?: number;
  iconSize?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export function IconTile({
  iconName,
  iconUrl,
  shape = 'circle',
  size = 56,
  width,
  height,
  iconSize = 24,
  backgroundColor,
  iconColor
}: IconTileProps): React.ReactElement {
  const shapeClass = shape === 'circle' ? styles.circle : styles.square;
  return (
    <div
      className={`${styles.tile} ${shapeClass}`}
      style={{ width: width ?? size, height: height ?? size, backgroundColor, color: iconColor }}
    >
      {iconUrl ? (
        <img src={iconUrl} alt="" style={{ maxWidth: iconSize, maxHeight: iconSize, width: 'auto', height: 'auto' }} />
      ) : iconName ? (
        <Icon name={iconName} size={iconSize} />
      ) : null}
    </div>
  );
}
