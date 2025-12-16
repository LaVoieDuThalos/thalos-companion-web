import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import CustomCard from '../../components/common/CustomCard/CustomCard';
import {
  type RoomKey,
  type RoomKeyHistory,
  type RoomKeyOwner,
} from '../../model/RoomKey';
import { keyService } from '../../services/KeyService';

import Icon from '../../components/common/Icon';
import UserSelectModal from '../../components/modals/UserSelectModal/UserSelectModal';
import type { User } from '../../model/User';
import './KeyPage.scss';
import KeyHistoryCard from './components/KeyHistoryCard/KeyHistoryCard.tsx';

export default function KeyPage() {
  const { keyId } = useParams<{ keyId: string }>();
  const [key, setKey] = useState<RoomKey | undefined>(undefined);
  const [keyHistory, setKeyHistory] = useState<RoomKeyHistory>([]);
  const [userSelectModalVisible, setUserSelectModalVisible] = useState(false);

  useEffect(() => {
    keyService
      .findKeyById(keyId!)
      .then((key) =>
        keyService.findHistory(keyId).then((history) => ({ key, history }))
      )
      .then(({ key, history }) => {
        if (key != null) {
          setKey(key);
        }
        setKeyHistory(history);
      });
  }, [keyId]);

  const updateOwner = (user: User) => {
    keyService
      .updateKey({
        ...key,
        owner: {
          id: user.id,
          name: user.name,
        } as RoomKeyOwner,
      } as RoomKey)
      .then((newKeyAndHistory) => {
        setKey(newKeyAndHistory.key);
        setKeyHistory(newKeyAndHistory.history);
        setUserSelectModalVisible(false);
      });
  };

  return (
    <div className="main-content">
      <UserSelectModal
        title={`A qui affecter le badge ${key?.name} ?`}
        show={userSelectModalVisible}
        onCancel={() => setUserSelectModalVisible(false)}
        onSuccess={(user) => updateOwner(user)}
      />
      <CustomCard clickable>
        <div className="key-details">
          <Icon icon="key" iconSize={50} />
          <div className="key-name">{key?.name}</div>
          <div className="key-owner">{key?.owner ? key.owner.name : '?'}</div>
          <div className="key-actions">
            <Button onClick={() => setUserSelectModalVisible(true)}>
              Assigner à ...
            </Button>
          </div>
        </div>
      </CustomCard>

      <KeyHistoryCard keyHistory={keyHistory} />
    </div>
  );
}
