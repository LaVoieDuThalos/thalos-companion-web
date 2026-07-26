import { Badge } from 'react-bootstrap';
import Icon from '../common/Icon';

type Props = {
  icon: string;
  size: number;
  value: string;
};

export default function IconWithPill({ icon, size, value }: Props) {
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
        <Badge bg="primary" pill>
          {value}
        </Badge>
      </div>
    </>
  );
}
