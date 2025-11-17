import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import CustomCard from '../../components/common/CustomCard/CustomCard';
import {
  type RoomKey,
  type RoomKeyHistory,
  type RoomKeyHistoryEntry,
  type RoomKeyOwner,
} from '../../model/RoomKey';
import { keyService } from '../../services/KeyService';

import Icon from '../../components/common/Icon';
import UserSelectModal from '../../components/modals/UserSelectModal/UserSelectModal';
import type { User } from '../../model/User';
import './KeyPage.scss';

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

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString() + ' - ' + d.getHours() + ':' + d.getMinutes();
  };

  const updateOwner = (user: User) => {
    keyService
      .updateKey({
        ...key,
        owner: {
          id: user.id,
          name: user.name,
        } as RoomKeyOwner,
      } as RoomKey)
      .then((newKey) => {
        return keyService
          .addToHistory({
            date: new Date().toISOString(),
            keyId: key?.id,
            from: key?.owner,
            to: newKey.owner,
          } as RoomKeyHistoryEntry)
          .then((history) => ({ key: newKey, history }));
      })
      .then((newKeyAndHistory) => {
        setKey(newKeyAndHistory.key);
        setKeyHistory(newKeyAndHistory.history);
        setUserSelectModalVisible(false);
      });
  };

  return (
    <div className="main-content">
      <UserSelectModal
        title={`A qui donner ${key?.name} ?`}
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
              Donner à ...
            </Button>
          </div>
        </div>
      </CustomCard>
      <CustomCard>
        <div className="history">
          <h4>Historique</h4>
          {keyHistory.map((entry) => (
            <div key={entry.date} className="entry">
              <span className="date">{formatDate(entry.date)}</span>
              <span className="from-name">{entry.from.name}</span>
              <span className="separator">
                <Icon icon="double_arrow" iconSize={16} />
              </span>
              <span className="to-name">{entry.to.name}</span>
            </div>
          ))}
        </div>
      </CustomCard>
    </div>
  );
}
