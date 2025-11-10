import type { CSSProperties } from 'react';
import Icon from './Icon';

type Props = {
  icon?: string;
  size?: number;
  color?: string;
  styles?: CSSProperties;
  children?: React.ReactNode;
};

export default function Label({ icon, color, size, styles, children }: Props) {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        ...styles,
      }}
    >
      {icon ? <Icon icon={icon} iconSize={size} color={color} /> : null}
      {children}
    </span>
  );
}
