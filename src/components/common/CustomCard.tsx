import { Card, type CardProps } from 'react-bootstrap';
import { concatStyles, type Styles } from './Types';

type Props = Omit<CardProps, 'style'> & {
  style?: Styles;
};

export default function CustomCard({ children, style, ...props }: Props) {
  return (
    <Card
      {...props}
      style={{
        ...concatStyles(style),
      }}
    >
      {children}
    </Card>
  );
}
