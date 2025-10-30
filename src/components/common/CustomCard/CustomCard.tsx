import { Card, type CardProps } from 'react-bootstrap';
import { concatStyles, type Styles } from '../Types';

import './CustomCard.scss';

type Props = Omit<CardProps, 'style'> & {
  style?: Styles;
};

export default function CustomCard({
  children,
  style,
  className,
  ...props
}: Props) {
  return (
    <Card
      {...props}
      className={`custom-card ${className}`}
      style={{
        ...concatStyles(style),
      }}
    >
      {children}
    </Card>
  );
}
