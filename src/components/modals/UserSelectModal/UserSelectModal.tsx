import { useEffect, useState } from 'react';
import { Colors } from '../../../constants/Colors';
import type { User } from '../../../model/User';
import { userService } from '../../../services/UserService';
import ActivityIndicator from '../../common/ActivityIndicator';
import CustomCard from '../../common/CustomCard/CustomCard';
import Icon from '../../common/Icon';
import type {
  ModalAction,
  ModalPageProps,
} from '../../common/ModalPage/ModalPage';
import ModalPage from '../../common/ModalPage/ModalPage';
import View from '../../common/View';
import './UserSelectModal.scss';
import { ROLE_OUVREUR } from '../../../constants/Roles.ts';
import Label from '../../common/Label.tsx';
import type { RoomKey } from '../../../model/RoomKey.ts';
import { keyService } from '../../../services/KeyService.ts';

type Props = ModalPageProps & {
  onSuccess: (user: User) => void;
  title?: string;
  onCancel: () => void;
};

function UserCard({ user, roomKeys }: { user: User, roomKeys?: RoomKey[] }) {
  return (
    <div className="user">
      <Icon icon="person" color={Colors.gray} iconSize={30} />
      <span className="name">{user.name}</span>
      {roomKeys ? roomKeys.map(key => <span key={key.id} className="room-key">{key.name}</span>) : null}
    </div>
  );
}

export default function UserSelectModal({
  onCancel,
  onSuccess,
  ...props
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<RoomKey[]>([]);

  useEffect(() => {
    setLoading(true);
    userService
      .findAllUsers(false)
      .then((users) => {
        setUsers(users);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    keyService.findAllKeys().then(keys => setKeys(keys));
  }, []);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      onClick: () => onCancel(),
    },
  ];

  return (
    <ModalPage
      {...props}
      onHide={onCancel}
      options={{ title: props.title, actions: ACTIONS }}
    >
      {loading ? (
        <View>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : null}
      <div className="users">
        <Label>Ouvreurs / Ouvreuses déclarés</Label>
        {users
          .filter(u => u.preferences?.roles?.includes(ROLE_OUVREUR.id))
          .map((user) => (
          <CustomCard clickable onClick={() => onSuccess(user)}>
            <UserCard user={user}  roomKeys={keys.filter(k => k.owner?.id === user.id)}/>
          </CustomCard>
        ))}
        <Label>Autres utilisateurs</Label>
        {users
          .filter(u => !u.preferences?.roles?.includes(ROLE_OUVREUR.id))
          .map((user) => (
            <CustomCard clickable onClick={() => onSuccess(user)}>
              <UserCard user={user}  roomKeys={keys.filter(k => k.owner?.id === user.id)}/>
            </CustomCard>
          ))}
      </div>
    </ModalPage>
  );
}
