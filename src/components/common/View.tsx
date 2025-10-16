import { type ReactNode } from 'react';
import { concatStyles, type Styles } from './Types';

export type ViewProps = {
  style?: Styles;
  className?: string;
  children?: ReactNode;
};

export default function View({ style, className, children }: ViewProps) {
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    ...concatStyles(style),
  };
  return (
    <div style={styles} className={className}>
      {children ?? null}
    </div>
  );
}
