import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Colors } from '../constants/Colors';
import type { RoomKey } from '../model/RoomKey';
import type { User } from '../model/User';
import Icon from './common/Icon';
import View from './common/View';
import UserSelectModal from './modals/UserSelectModal';

type Props = {
  roomKey: RoomKey;
  onChangeOwner: (user: User) => void;
};

export default function RoomKeyCard({ roomKey, onChangeOwner }: Props) {
  const [userSelectModalVisible, setUserSelectModalVisible] = useState(false);

  const onSelectUser = (user: User) => {
    onChangeOwner(user);
    setUserSelectModalVisible(false);
  };

  return (
    <Card>
      {
        <UserSelectModal
          title="Qui ?"
          show={userSelectModalVisible}
          onCancel={() => setUserSelectModalVisible(false)}
          onSuccess={onSelectUser}
        />
      }
      <button onClick={() => setUserSelectModalVisible(true)}>
        <View style={{}}>
          <View style={{}}>
            <Icon icon="key" color={Colors.white} iconSize={50} />
          </View>
          <View style={{}}>
            <View>
              <span>{roomKey.name}</span>

              <View style={{}}>
                <Icon icon="person" iconSize={30} />
                {roomKey.owner ? (
                  <span style={{}}>{roomKey.owner.name}</span>
                ) : (
                  <span>?</span>
                )}
              </View>
            </View>
          </View>
        </View>
      </button>
    </Card>
  );
}
