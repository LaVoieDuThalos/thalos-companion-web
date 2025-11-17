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

type Props = ModalPageProps & {
  onSuccess: (user: User) => void;
  title?: string;
  onCancel: () => void;
};

function UserCard({ user }: { user: User }) {
  return (
    <div className="user">
      <Icon icon="person" color={Colors.gray} iconSize={30} />
      <span className="name">{user.name}</span>
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

  useEffect(() => {
    setLoading(true);
    userService
      .findAllUsers(false)
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
      <div className="users">
        {users.map((user) => (
          <CustomCard clickable onClick={() => onSuccess(user)}>
            <UserCard user={user} />
          </CustomCard>
        ))}
      </div>
    </ModalPage>
  );
}
