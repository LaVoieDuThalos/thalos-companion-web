import { Card, type CardProps } from 'react-bootstrap';
import { concatStyles, type Styles } from '../Types';

import './CustomCard.scss';

type Props = Omit<CardProps, 'style'> & {
  style?: Styles;
  clickable?: boolean;
};

export default function CustomCard({
  children,
  style,
  className,
  clickable,
  ...props
}: Props) {
  return (
    <Card
      {...props}
      className={`custom-card ${className} ${props.onClick && clickable ? 'clickable' : ''}`}
      style={{
        ...concatStyles(style),
      }}
    >
      {children}
    </Card>
  );
}
