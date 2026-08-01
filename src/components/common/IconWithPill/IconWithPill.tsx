import { Badge } from 'react-bootstrap';
import Icon from '../Icon';

type Props = {
  icon: string;
  size: number;
  value: string;
  color?: string;
};

export default function IconWithPill({
  icon,
  size,
  value,
  color = 'primary',
}: Props) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Icon icon={icon} iconSize={size} />
        <Badge bg={color} pill>
          {value}
        </Badge>
      </div>
    </>
  );
}
