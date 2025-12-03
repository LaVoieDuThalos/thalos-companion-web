import { useNavigate } from 'react-router';
import './RoomKeyCard.scss';
import type { RoomKey } from '../../../../model/RoomKey.ts';
import CustomCard from '../../../../components/common/CustomCard/CustomCard.tsx';
import Icon from '../../../../components/common/Icon.tsx';

type Props = {
  roomKey: RoomKey;
};

export default function RoomKeyCard({ roomKey }: Props) {
  const navigate = useNavigate();

  return (
    <CustomCard clickable onClick={() => navigate('/keys/' + roomKey.id)}>
      <div className="key">
        <Icon icon="key" iconSize={50} />
        <div className="key-details">
          <span className="key-name">{roomKey.name}</span>
          <div className="key-owner">
            <Icon icon="person" iconSize={30} />
            {roomKey.owner ? (
              <span style={{}}>{roomKey.owner.name}</span>
            ) : (
              <span>?</span>
            )}
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
