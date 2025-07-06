import { useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import type { GameDay } from '../../model/GameDay';
import type { OpenCloseRoom } from '../../model/Room';
import type { User } from '../../model/User';
import { calendarService } from '../../services/CalendarService';
import { roomService } from '../../services/RoomService';
import { userService } from '../../services/UserService';
import { printGameDay } from '../../utils/Utils';
import Icon from '../common/Icon';
import type { ModalAction, ModalPageProps } from '../common/ModalPage';
import ModalPage from '../common/ModalPage';
import type { StyleSheet } from '../common/Types';
import View from '../common/View';

type Props = ModalPageProps & {
  day: GameDay;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function OpenCloseRoomConfigModal({
  day,
  onSuccess,
  onCancel,
  ...props
}: Props) {
  const [loading, setLoading] = useState(false);

  const hours = calendarService.hours(8, [15, 30, 45]);

  const [users, setUsers] = useState<User[]>([]);

  const [model, setModel] = useState<OpenCloseRoom>({
    dayId: day.id,
    openAt: '20h',
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      roomService.getOpenCloseConfig(day.id),
      userService.findAllUsers(),
    ]).then(([model, users]) => {
      setUsers(users.filter((u) => !!u.name));
      setModel(model);
      setLoading(false);
    });
  }, [day.id]);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: loading,
      color: 'gray',
      onClick: () => onCancel(),
    },
    {
      name: 'save',
      label: 'Enregistrer',
      disabled: loading,
      onClick: () => {
        console.log('Save open/close configuration', model);
        setLoading(true);
        roomService
          .saveOpenCloseConfig(model)
          .then(() => {
            onSuccess();
            setLoading(false);
          })
          .catch(() => setLoading(false));
      },
    },
  ];

  const onOpenerChange = (userId: string) => {
    userService.getUserById(userId).then((user) => {
      if (user === null) {
        throw new Error('User not found : id=' + userId);
      }
      setModel((prev) => ({
        ...prev,
        opener: { id: userId, name: user?.name || '' },
        closer: prev.closer ?? { id: userId, name: user?.name || '' },
      }));
    });
  };

  const onCloserChange = (userId: string) => {
    userService.getUserById(userId).then((user) => {
      if (user === null) {
        throw new Error('User not found : id=' + userId);
      }
      setModel((prev) => ({
        ...prev,
        closer: { id: userId, name: user?.name || '' },
      }));
    });
  };

  return (
    <ModalPage
      {...props}
      onHide={onCancel}
      options={{
        title: 'Ouverture et fermeture de la salle',
        actions: ACTIONS,
      }}
    >
      <span>{printGameDay(day)}</span>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon icon="lock_open" iconSize={20} />
          <span style={styles.label}>Ouverture</span>
        </View>

        <Form.Group className="mb-3" controlId="eventForm.DateInput">
          <Form.Label>A</Form.Label>
          <Form.Select
            size="lg"
            disabled={loading}
            value={model?.openAt}
            onChange={(h) =>
              setModel((prev) => ({ ...prev, openAt: h.target.value }))
            }
          >
            <option>-</option>
            {hours.map((hh) => (
              <option key={hh} value={hh}>
                {hh}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="eventForm.DateInput">
          <Form.Label>Par</Form.Label>
          <Form.Select
            size="lg"
            disabled={loading}
            value={model.opener?.id}
            onChange={({ target: { value } }) => onOpenerChange(value)}
          >
            <option>-</option>
            {users.map((usr) => (
              <option key={usr.id} value={usr.id}>
                {usr.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Card>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon icon="lock" iconSize={20} />
          <span style={styles.label}>Fermeture</span>
        </View>

        <Form.Group className="mb-3" controlId="eventForm.DateInput">
          <Form.Label>Par</Form.Label>
          <Form.Select
            size="lg"
            disabled={loading}
            value={model.closer?.id}
            onChange={({ target: { value } }) => onCloserChange(value)}
          >
            <option>-</option>
            {users.map((usr) => (
              <option key={usr.id} value={usr.id}>
                {usr.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Card>
    </ModalPage>
  );
}

const styles: StyleSheet = {
  label: {
    fontWeight: 'bold',
    fontSize: 20,
  },
};
