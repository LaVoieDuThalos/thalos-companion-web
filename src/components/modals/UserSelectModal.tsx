import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Colors } from '../../constants/Colors';
import type { User } from '../../model/User';
import { userService } from '../../services/UserService';
import ActivityIndicator from '../common/ActivityIndicator';
import Icon from '../common/Icon';
import type {
  ModalAction,
  ModalPageProps,
} from '../common/ModalPage/ModalPage';
import ModalPage from '../common/ModalPage/ModalPage';
import View from '../common/View';

type Props = ModalPageProps & {
  onSuccess: (user: User) => void;
  title?: string;
  onCancel: () => void;
};

function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <View style={{}}>
        <Icon icon="person" color={Colors.gray} iconSize={30} />
        <span>{user.name}</span>
      </View>
    </Card>
  );
}

export default function UserSelectModal({ onCancel, ...props }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userService
      .findAllUsers()
      .then((users) => {
        setUsers(users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
      <div style={{}}>
        {users.map((user) => (
          <button key={user.id} onClick={() => props.onSuccess(user)}>
            <UserCard user={user} />
          </button>
        ))}
      </div>
    </ModalPage>
  );
}
